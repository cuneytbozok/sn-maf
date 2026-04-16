gs.include('MAFMetricCollectorBase')
gs.include('MAFDeclarativeCollector')
gs.include('MAFCollectorFactory')
gs.include('MAFScoringEngine')
gs.include('MAFAISummaryProvider')

var MAFAssessmentRunner = Class.create()
MAFAssessmentRunner.prototype = {
  /**
   * Schedules background processing when GlideScriptedProgressWorker is available; otherwise runs synchronously.
   * @param {string} runSysId
   * @returns {boolean}
   */
  run: function (runSysId) {
    if (!this._claimRun(runSysId)) return false
    try {
      var w = new GlideScriptedProgressWorker()
      w.setProgressName('MAF Assessment Run')
      w.setScriptIncludeName('MAFAssessmentRunner')
      w.setScriptIncludeMethod('backgroundProcess')
      if (typeof w.putMethodArg === 'function') w.putMethodArg('runSysId', runSysId)
      else if (typeof w.putParameter === 'function') w.putParameter('runSysId', runSysId)
      w.start()
      return true
    } catch (e) {
      gs.warn('MAFAssessmentRunner: background worker unavailable, running synchronously: ' + e)
      try {
        this._executeRun(runSysId)
        return true
      } catch (e2) {
        this._failRun(runSysId, 'Run failed: ' + e2)
        return false
      }
    }
  },

  /**
   * Entry point for GlideScriptedProgressWorker (same scope).
   * @param {string} runSysId
   */
  backgroundProcess: function (runSysId) {
    try {
      this._executeRun(runSysId)
    } catch (e) {
      this._failRun(runSysId, String(e))
    }
  },

  /**
   * Full synchronous execution (metrics → category scores → AI summary).
   * @param {string} runSysId
   */
  runSync: function (runSysId) {
    if (!this._claimRun(runSysId)) return
    this._executeRun(runSysId)
  },

  _failRun: function (runSysId, message) {
    var gr = new GlideRecord('x_maf_core_assessment_run')
    if (!gr.get(runSysId)) return
    gr.setValue('state', 'error')
    var prev = gr.getValue('error_message')
    gr.setValue('error_message', (prev ? prev + '\n' : '') + String(message).substring(0, 4000))
    gr.update()
  },

  _claimRun: function (runSysId) {
    var max = parseInt(gs.getProperty('x_maf_core.max_concurrent_runs', '1'), 10)
    if (isNaN(max) || max < 1) max = 1
    var ga = new GlideAggregate('x_maf_core_assessment_run')
    ga.addAggregate('COUNT', null)
    ga.addQuery('state', 'running')
    ga.query()
    var cnt = 0
    if (ga.next()) {
      cnt = parseInt(ga.getAggregate('COUNT', null), 10)
      if (isNaN(cnt)) cnt = 0
    }
    if (cnt >= max) {
      gs.addErrorMessage('Maximum concurrent MAF assessment runs (' + max + ') reached. Try again later.')
      return false
    }
    var gr = new GlideRecord('x_maf_core_assessment_run')
    if (!gr.get(runSysId)) return false
    if (gr.getValue('state') !== 'draft') {
      gs.addErrorMessage('Assessment run must be in Draft state to execute.')
      return false
    }
    gr.setValue('state', 'running')
    gr.setValue('started_at', new GlideDateTime())
    gr.setValue('triggered_by', gs.getUserID())
    gr.setValue('error_message', '')
    gr.update()
    return true
  },

  _executeRun: function (runSysId) {
    var runGR = new GlideRecord('x_maf_core_assessment_run')
    if (!runGR.get(runSysId)) throw new Error('Assessment run not found')

    var packsRaw = runGR.getValue('packs')
    if (!packsRaw || String(packsRaw).trim() === '') {
      this._failRun(runSysId, 'No packs selected on the assessment run.')
      return
    }

    var packIds = []
    var parts = String(packsRaw).split(',')
    for (var i = 0; i < parts.length; i++) {
      var p = String(parts[i]).trim()
      if (p) packIds.push(p)
    }
    if (packIds.length === 0) {
      this._failRun(runSysId, 'No packs selected on the assessment run.')
      return
    }

    var catGr = new GlideRecord('x_maf_core_category')
    catGr.addQuery('pack', 'IN', packIds.join(','))
    catGr.query()
    var catIds = []
    while (catGr.next()) catIds.push(catGr.getUniqueValue())

    if (catIds.length === 0) {
      this._failRun(runSysId, 'Selected packs have no categories.')
      return
    }

    var md = new GlideRecord('x_maf_core_metric_definition')
    md.addQuery('active', true)
    md.addQuery('category', 'IN', catIds.join(','))
    md.query()

    var factory = new MAFCollectorFactory()
    var scoring = new MAFScoringEngine()

    while (md.next()) {
      this._collectOneMetric(md.getUniqueValue(), runGR, runSysId, factory, scoring)
    }

    scoring.applyTrendDeltas(runSysId)

    runGR.get(runSysId)
    runGR.setValue('state', 'collected')
    runGR.update()

    scoring.scoreRun(runSysId)

    runGR.get(runSysId)
    runGR.setValue('state', 'scored')
    runGR.update()

    var ai = new MAFAISummaryProvider()
    ai.generate(runSysId)

    runGR.get(runSysId)
    runGR.setValue('state', 'summarized')
    runGR.update()

    runGR.get(runSysId)
    runGR.setValue('state', 'complete')
    runGR.setValue('completed_at', new GlideDateTime())
    runGR.update()
  },

  _collectOneMetric: function (metricDefSysId, runGR, runSysId, factory, scoring) {
    var metricDefGR = new GlideRecord('x_maf_core_metric_definition')
    if (!metricDefGR.get(metricDefSysId)) return

    var ct = metricDefGR.getValue('collector_type')

    // Manual metrics get a pending_input placeholder; no collector invoked (plan phase 4).
    if (ct === 'manual') {
      var mrManual = new GlideRecord('x_maf_core_metric_result')
      mrManual.initialize()
      mrManual.setValue('assessment_run', runSysId)
      mrManual.setValue('metric_definition', metricDefGR.getUniqueValue())
      mrManual.setValue('collected_at', new GlideDateTime())
      mrManual.setValue('rag_status', 'pending_input')
      mrManual.setValue('result_mode', 'manual')
      this._copyAdvisoryDefaults(metricDefGR, mrManual)
      mrManual.insert()
      return
    }

    var raw
    var errMsg = null
    var drillTable = null
    var drillQuery = null
    try {
      var collector
      if (ct === 'declarative') {
        collector = new MAFDeclarativeCollector(metricDefGR, runGR)
      } else {
        var cn = metricDefGR.getValue('script_include')
        collector = factory.getCollector(cn, metricDefGR, runGR)
      }
      var res = collector.collect()
      if (res.error) errMsg = res.error
      else {
        raw = res.value
        drillTable = res.drillDownTable
        drillQuery = res.drillDownQuery
      }
    } catch (e) {
      errMsg = String(e)
    }

    var mr = new GlideRecord('x_maf_core_metric_result')
    mr.initialize()
    mr.setValue('assessment_run', runSysId)
    mr.setValue('metric_definition', metricDefGR.getUniqueValue())
    mr.setValue('collected_at', new GlideDateTime())
    mr.setValue('result_mode', 'auto')
    if (errMsg) {
      mr.setValue('rag_status', 'error')
      mr.setValue('collection_error', String(errMsg).substring(0, 4000))
    } else if (raw === null || typeof raw === 'undefined' || (typeof raw === 'number' && isNaN(raw))) {
      mr.setValue('rag_status', 'error')
      mr.setValue('collection_error', 'Collector returned no numeric value')
    } else {
      var norm = scoring.normalize(raw, metricDefGR)
      mr.setValue('raw_value', raw)
      mr.setValue('normalized_score', norm.score)
      mr.setValue('rag_status', norm.rag)
      if (drillTable) mr.setValue('drill_down_table', drillTable)
      if (drillQuery) mr.setValue('drill_down_query', drillQuery)
      this._copyAdvisoryDefaults(metricDefGR, mr)
    }
    mr.insert()
  },

  /**
   * Copy curated advisory defaults from metric_definition onto the metric_result
   * as a point-in-time snapshot. Skipped for error results (they carry their own
   * message via collection_error). PRD §9.1 — curated first, AI second.
   */
  _copyAdvisoryDefaults: function (metricDefGR, mr) {
    var fields = [
      ['default_likely_cause', 'likely_cause'],
      ['default_suggested_action', 'suggested_action'],
      ['default_owner_role', 'owner_role'],
      ['default_effort_tshirt', 'effort_tshirt'],
    ]
    for (var i = 0; i < fields.length; i++) {
      var src = fields[i][0]
      var dst = fields[i][1]
      var v = metricDefGR.getValue(src)
      if (v !== null && typeof v !== 'undefined' && String(v) !== '') {
        mr.setValue(dst, v)
      }
    }
    // quick_win is a boolean — always carry it across
    mr.setValue('quick_win_flag', metricDefGR.getValue('default_quick_win_flag') === '1' || metricDefGR.getValue('default_quick_win_flag') === 'true' ? true : false)
  },

  type: 'MAFAssessmentRunner',
}
