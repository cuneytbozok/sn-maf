/**
 * Callable helpers for Background Scripts: synthetic checks for {@link MAFDurationCollector},
 * {@link MAFWindowedRatioCollector}, {@link MAFCrossTableRatioCollector}, and
 * {@link MAFGroupedAverageCollector} math plus canonical migration JSON for ITSM metrics.
 *
 * PRD §4.6 scoring fixtures: {@link #syntheticAggregateSubCategories}, {@link #runScoringFixtureSanityChecks}.
 * PRD §5 schema introspection examples: {@link #getSchemaIntrospectionCountParamsJson}, etc.
 */
var MAFCollectorTestFixtures = Class.create()
MAFCollectorTestFixtures.prototype = {
  /**
   * script_params JSON for mttr_hours_30d migration (must match ITSMMTTRCollector ±0.01h).
   */
  getMttrMigrationParamsJson: function () {
    return JSON.stringify({
      table: 'incident',
      start_field: 'opened_at',
      end_field: 'resolved_at',
      filter: 'stateIN6,7',
      window_field: 'resolved_at',
      window_days: 30,
      unit: 'hours',
      aggregation: 'avg',
    })
  },

  /**
   * script_params JSON for reopen_rate_30d migration.
   */
  getReopenMigrationParamsJson: function () {
    return JSON.stringify({
      table: 'incident',
      numerator_filter: 'stateIN6,7^reopen_count>0',
      denominator_filter: 'stateIN6,7',
      window_field: 'resolved_at',
      window_days: 30,
      empty_denominator_value: 0,
    })
  },

  /**
   * script_params JSON matching PRD §5.2 (catalog UI policy vs active catalog items).
   */
  getCrossTableRatioExampleParamsJson: function () {
    return JSON.stringify({
      numerator_table: 'catalog_ui_policy',
      numerator_filter: 'active=true',
      numerator_distinct_field: 'catalog_item',
      denominator_table: 'sc_cat_item',
      denominator_filter: 'active=true',
      denominator_distinct_field: null,
      empty_denominator_value: 0,
    })
  },

  /**
   * script_params JSON matching PRD §5.3 (variables per catalog item).
   */
  getGroupedAverageExampleParamsJson: function () {
    return JSON.stringify({
      child_table: 'item_option_new',
      parent_field: 'cat_item',
      child_filter: 'active=true',
      parent_table: 'sc_cat_item',
      parent_filter: 'active=true',
      aggregation: 'avg',
      include_zero_parents: true,
    })
  },

  /**
   * Pure JS: same median / p90 / p95 logic as MAFDurationCollector (sorted array, hours).
   */
  syntheticDurationStatsHours: function (hoursArray) {
    var vals = []
    for (var i = 0; i < hoursArray.length; i++) vals.push(Number(hoursArray[i]))
    vals.sort(function (a, b) {
      return a - b
    })
    var n = vals.length
    if (n === 0) return { median: null, p90: null, p95: null, avg: null }
    var sum = 0
    for (var j = 0; j < n; j++) sum += vals[j]
    return {
      median: this._medianSorted(vals),
      p90: this._percentileSorted(vals, 90),
      p95: this._percentileSorted(vals, 95),
      avg: sum / n,
    }
  },

  /** Ratio * 100, same semantics as MAFWindowedRatioCollector / MAFCrossTableRatioCollector. */
  syntheticRatioPercent: function (numeratorCount, denominatorCount, emptyDenominatorValue) {
    var e = emptyDenominatorValue
    if (e === null || typeof e === 'undefined') e = 0
    if (!denominatorCount || denominatorCount === 0) return Number(e)
    return (numeratorCount / denominatorCount) * 100
  },

  /**
   * Same aggregation rules as MAFGroupedAverageCollector over a numeric array (per-parent counts).
   */
  syntheticGroupedAggregate: function (countsArray, aggregation) {
    var agg = String(aggregation || 'avg').toLowerCase()
    var a = []
    for (var i = 0; i < countsArray.length; i++) a.push(Number(countsArray[i]))
    if (a.length === 0) return null
    if (agg === 'max') {
      var mx = a[0]
      for (var j = 1; j < a.length; j++) if (a[j] > mx) mx = a[j]
      return mx
    }
    if (agg === 'min') {
      var mn = a[0]
      for (var k = 1; k < a.length; k++) if (a[k] < mn) mn = a[k]
      return mn
    }
    a.sort(function (x, y) {
      return x - y
    })
    var n = a.length
    if (agg === 'median') return this._medianSorted(a)
    if (agg === 'p90') return this._percentileSorted(a, 90)
    if (agg === 'avg') {
      var sum = 0
      for (var m = 0; m < n; m++) sum += a[m]
      return sum / n
    }
    return null
  },

  /**
   * ITSM pack v3 — instance QA: table/field presence, fragile encoded queries (PRD §7 CD/FM/VAR/TAX/ASN),
   * optional verification that category scores for an assessment run are finite 0–100.
   * Background Script: gs.include('MAFCollectorTestFixtures'); new MAFCollectorTestFixtures().runInstanceDependencyAudit(runSysIdOrEmptyString);
   * @param {string} [assessmentRunSysId]
   * @returns {{ pass: boolean, checks: Array<{id: string, ok: boolean, detail: string}> }}
   */
  runInstanceDependencyAudit: function (assessmentRunSysId) {
    var results = { pass: true, checks: [] }
    var self = this
    function addCheck(id, ok, detail) {
      if (!ok) results.pass = false
      results.checks.push({ id: id, ok: !!ok, detail: String(detail || '') })
      gs.info('MAF instance QA [' + id + '] ' + (ok ? 'OK' : 'FAIL') + ' — ' + detail)
    }

    function tableOk(name) {
      var gr = new GlideRecord(String(name))
      return gr.isValid()
    }

    function fieldOk(table, field) {
      var gr = new GlideRecord(String(table))
      if (!gr.isValid()) return false
      return gr.isValidField(String(field))
    }

    /**
     * GlideAggregate smoke test: invalid encoded queries often surface here.
     */
    function gaSmoke(table, encodedQuery) {
      try {
        var ga = new GlideAggregate(String(table))
        ga.addAggregate('COUNT', '*')
        if (encodedQuery) ga.addEncodedQuery(String(encodedQuery))
        ga.query()
        ga.next()
        return { ok: true, err: null }
      } catch (e) {
        return { ok: false, err: String(e) }
      }
    }

    var fragileQueries = [
      {
        id: 'cd1_sys_script',
        table: 'sys_script',
        q: 'collection=incident^active=true^sys_package.source!=com.snc.incident',
      },
      {
        id: 'cd2_sys_script_client',
        table: 'sys_script_client',
        q: 'table=incident^active=true^sys_package.source!=com.snc.incident',
      },
      {
        id: 'cd3_sys_script_chg',
        table: 'sys_script',
        q: 'collection=change_request^active=true^sys_package.source!=com.snc.change_management',
      },
      {
        id: 'fm5_num',
        table: 'sys_hub_action_instance',
        q: 'action_typeLIKEsubflow',
      },
      {
        id: 'fm5_den',
        table: 'sys_hub_flow',
        q: 'active=true^typeISNOTEMPTY',
      },
      {
        id: 'var3_num',
        table: 'io_set_item',
        q: 'sys_idISNOTEMPTY',
      },
      {
        id: 'tax3_num',
        table: 'm2m_connected_content',
        q: 'content_type=98f9a16553622010069addeeff7b1248',
      },
      {
        id: 'asn2_num',
        table: 'awa_assignment',
        q: 'sys_created_on>=javascript:gs.daysAgoStart(30)',
      },
      {
        id: 'asn2_den',
        table: 'incident',
        q: 'stateIN6,7^resolved_at>=javascript:gs.daysAgoStart(30)',
      },
    ]

    var tables = [
      'io_set_item',
      'sys_hub_action_instance',
      'sys_hub_flow',
      'awa_service_channel',
      'awa_assignment',
      'm2m_connected_content',
      'taxonomy',
      'topic',
      'sc_cat_item',
      'catalog_ui_policy',
      'catalog_script_client',
    ]
    for (var ti = 0; ti < tables.length; ti++) {
      var tn = tables[ti]
      addCheck('table_' + tn, tableOk(tn), tableOk(tn) ? 'GlideRecord valid' : 'table missing or inaccessible')
    }

    addCheck(
      'fm5_action_type_field',
      fieldOk('sys_hub_action_instance', 'action_type'),
      fieldOk('sys_hub_action_instance', 'action_type')
        ? 'action_type present (seed uses action_typeLIKEsubflow)'
        : 'action_type missing — verify alternate field e.g. base_action per PRD §7.3',
    )
    addCheck(
      'fm5_flow_field',
      fieldOk('sys_hub_action_instance', 'flow'),
      fieldOk('sys_hub_action_instance', 'flow') ? 'flow reference present' : 'flow field missing on sys_hub_action_instance',
    )
    addCheck('var3_distinct_field', fieldOk('io_set_item', 'sc_cat_item'), fieldOk('io_set_item', 'sc_cat_item') ? 'sc_cat_item on io_set_item' : 'sc_cat_item not valid on io_set_item')
    addCheck(
      'tax3_fields',
      fieldOk('m2m_connected_content', 'content_type') && fieldOk('m2m_connected_content', 'catalog_item'),
      'content_type & catalog_item for TAX3',
    )

    for (var qi = 0; qi < fragileQueries.length; qi++) {
      var fq = fragileQueries[qi]
      if (!tableOk(fq.table)) {
        addCheck('ga_' + fq.id, false, 'skip: table ' + fq.table + ' invalid')
        continue
      }
      var g = gaSmoke(fq.table, fq.q)
      addCheck('ga_' + fq.id, g.ok, g.ok ? 'GlideAggregate encoded query accepted' : 'query error: ' + g.err)
    }

    if (assessmentRunSysId) {
      var runId = String(assessmentRunSysId).trim()
      var runGr = new GlideRecord('x_maf_core_assessment_run')
      if (!runGr.get(runId)) {
        addCheck('run_exists', false, 'x_maf_core_assessment_run not found: ' + runId)
      } else {
        addCheck('run_exists', true, 'assessment run ' + runId)
        var cs = new GlideRecord('x_maf_core_category_score')
        cs.addQuery('assessment_run', runId)
        cs.query()
        var anyCs = false
        while (cs.next()) {
          anyCs = true
          var sc = parseFloat(cs.getValue('score'))
          var finite = !isNaN(sc) && isFinite(sc)
          var inRange = finite && sc >= 0 && sc <= 100
          addCheck('category_score_' + cs.getUniqueValue(), inRange, 'score=' + cs.getValue('score') + ' rag=' + cs.getValue('rag_status'))
        }
        if (!anyCs) addCheck('category_scores', false, 'no x_maf_core_category_score rows for run (scoreRun not executed yet?)')
      }
    }

    gs.info('MAF instance QA: ' + (results.pass ? 'PASS' : 'FAIL') + ' (' + results.checks.length + ' checks)')
    return results
  },

  /**
   * Logs gs.info lines summarizing synthetic checks; returns a status string.
   */
  /**
   * PRD §4.6 — mirrors {@code src/pure/mafScoreRollup.js} pass 1 (Rhino, for Background Script / ATF).
   * @param {Array<{ metricDefinitionId: string, ragStatus: string, normalizedScore: number|null }>} metricResults
   * @param {Object<string, { subCategoryId: string|null, weight: number }>} defsByMetricId
   * @returns {Object<string, { wSum: number, weighted: number, total: number, green: number, amber: number, red: number, error: number }>}
   */
  syntheticAggregateSubCategories: function (metricResults, defsByMetricId) {
    var subCatAggregates = {}
    for (var i = 0; i < metricResults.length; i++) {
      var mr = metricResults[i]
      var def = defsByMetricId[mr.metricDefinitionId]
      if (!def) continue
      var subCatId = def.subCategoryId
      if (!subCatId) continue
      if (!subCatAggregates[subCatId]) {
        subCatAggregates[subCatId] = { wSum: 0, weighted: 0, total: 0, green: 0, amber: 0, red: 0, error: 0 }
      }
      var agg = subCatAggregates[subCatId]
      agg.total++
      var rs = mr.ragStatus
      if (rs === 'error') {
        agg.error++
        continue
      }
      if (rs === 'green') agg.green++
      else if (rs === 'amber') agg.amber++
      else if (rs === 'red') agg.red++
      var w = def.weight
      if (isNaN(w) || w === 0) continue
      var ns = mr.normalizedScore
      if (ns === null || typeof ns === 'undefined' || isNaN(Number(ns))) continue
      agg.weighted += Number(ns) * w
      agg.wSum += w
    }
    return subCatAggregates
  },

  /**
   * @param {Object} agg syntheticAggregateSubCategories bucket
   * @param {number} greenTh
   * @param {number} amberTh
   * @returns {{ score: number, rag: string }}
   */
  syntheticSubCategoryScoreFromAgg: function (agg, greenTh, amberTh) {
    var subScore = agg.wSum > 0 ? this._mafRollupRound2(agg.weighted / agg.wSum) : 0
    var subRag = 'red'
    if (subScore >= greenTh) subRag = 'green'
    else if (subScore >= amberTh) subRag = 'amber'
    return { score: subScore, rag: subRag }
  },

  /**
   * @param {Object<string, { categoryId: string, weightInCategory: number }>} subMetaById
   * @param {Object} subAggs from syntheticAggregateSubCategories
   * @param {number} greenTh
   * @param {number} amberTh
   */
  syntheticRollSubScoresIntoCategories: function (subMetaById, subAggs, greenTh, amberTh) {
    var catAggregates = {}
    for (var subId in subMetaById) {
      if (!subMetaById.hasOwnProperty(subId)) continue
      var meta = subMetaById[subId]
      var agg = subAggs[subId]
      if (!agg || agg.total === 0) continue
      var subSc = this.syntheticSubCategoryScoreFromAgg(agg, greenTh, amberTh)
      var subScore = subSc.score
      var catId = meta.categoryId
      var subW = meta.weightInCategory
      if (isNaN(subW) || subW === 0) subW = 0
      if (!catAggregates[catId]) {
        catAggregates[catId] = { wSum: 0, weighted: 0, total: 0, green: 0, amber: 0, red: 0, error: 0 }
      }
      var cAgg = catAggregates[catId]
      cAgg.weighted += subScore * subW
      cAgg.wSum += subW
      cAgg.total += agg.total
      cAgg.green += agg.green
      cAgg.amber += agg.amber
      cAgg.red += agg.red
      cAgg.error += agg.error
    }
    return catAggregates
  },

  syntheticCategoryScoreFromAgg: function (cAgg, greenTh, amberTh) {
    var catScore = cAgg.wSum > 0 ? this._mafRollupRound2(cAgg.weighted / cAgg.wSum) : 0
    var catRag = 'red'
    if (catScore >= greenTh) catRag = 'green'
    else if (catScore >= amberTh) catRag = 'amber'
    return { score: catScore, rag: catRag }
  },

  _mafRollupRound2: function (n) {
    return Math.round(Number(n) * 100) / 100
  },

  /**
   * Logs checks for PRD §4.6 fixtures; returns PASS/FAIL (aligns with npm test/mafScoreRollup.test.mjs).
   */
  runScoringFixtureSanityChecks: function () {
    var G = 75
    var A = 50
    var ok = true
    var self = this
    function expect(cond, msg) {
      if (!cond) {
        ok = false
        gs.warn('MAF scoring fixture: ' + msg)
      }
    }

    var empty = self.syntheticAggregateSubCategories([], {})
    expect(Object.keys(empty).length === 0, 'emptyRun')

    var nullDef = { m1: { subCategoryId: null, weight: 0.5 } }
    var nullAgg = self.syntheticAggregateSubCategories([{ metricDefinitionId: 'm1', ragStatus: 'green', normalizedScore: 80 }], nullDef)
    expect(Object.keys(nullAgg).length === 0, 'nullSubCategory')

    var defs1 = {
      m1: { subCategoryId: 's1', weight: 0.2 },
      m2: { subCategoryId: 's1', weight: 0.3 },
      m3: { subCategoryId: 's1', weight: 0.5 },
    }
    var rows1 = [
      { metricDefinitionId: 'm1', ragStatus: 'green', normalizedScore: 100 },
      { metricDefinitionId: 'm2', ragStatus: 'green', normalizedScore: 80 },
      { metricDefinitionId: 'm3', ragStatus: 'green', normalizedScore: 60 },
    ]
    var ag1 = self.syntheticAggregateSubCategories(rows1, defs1)
    var catAg1 = self.syntheticRollSubScoresIntoCategories({ s1: { categoryId: 'c1', weightInCategory: 1 } }, ag1, G, A)
    var sub1 = self.syntheticSubCategoryScoreFromAgg(ag1.s1, G, A)
    var cat1 = self.syntheticCategoryScoreFromAgg(catAg1.c1, G, A)
    expect(sub1.score === cat1.score && sub1.score === 74, 'singleSubCategory')

    var errDefs = {
      e1: { subCategoryId: 's1', weight: 0.2 },
      e2: { subCategoryId: 's1', weight: 0.2 },
      g1: { subCategoryId: 's1', weight: 0.2 },
      g2: { subCategoryId: 's1', weight: 0.2 },
      g3: { subCategoryId: 's1', weight: 0.2 },
    }
    var errAg = self.syntheticAggregateSubCategories(
      [
        { metricDefinitionId: 'e1', ragStatus: 'error', normalizedScore: null },
        { metricDefinitionId: 'e2', ragStatus: 'error', normalizedScore: null },
        { metricDefinitionId: 'g1', ragStatus: 'green', normalizedScore: 100 },
        { metricDefinitionId: 'g2', ragStatus: 'green', normalizedScore: 100 },
        { metricDefinitionId: 'g3', ragStatus: 'green', normalizedScore: 100 },
      ],
      errDefs,
    )
    expect(errAg.s1.error === 2 && errAg.s1.green === 3, 'errorMetrics')
    expect(self.syntheticSubCategoryScoreFromAgg(errAg.s1, G, A).score === 100, 'errorMetrics score')

    gs.info('MAFCollectorTestFixtures: runScoringFixtureSanityChecks ' + (ok ? 'PASS' : 'FAIL'))
    return ok ? 'MAFCollectorTestFixtures scoring: PASS' : 'MAFCollectorTestFixtures scoring: FAIL'
  },

  /** PRD §5.4.1 */
  getSchemaIntrospectionCountParamsJson: function () {
    return JSON.stringify({
      mode: 'count',
      table: 'sys_trigger',
      filter: 'state=error^next_action>=javascript:gs.daysAgoStart(7)',
    })
  },

  /** PRD §5.4.2 */
  getSchemaIntrospectionGroupCollisionParamsJson: function () {
    return JSON.stringify({
      mode: 'group_collision',
      table: 'sys_script',
      filter: 'active=true^when=before',
      group_by: 'collection,order',
      min_group_size: 2,
    })
  },

  /** PRD §5.4.3 */
  getSchemaIntrospectionRowCountOverThresholdParamsJson: function () {
    return JSON.stringify({
      mode: 'row_count_over_threshold',
      metadata_table: 'sys_db_object',
      metadata_filter: 'super_class=NULL^name!STARTSWITHsys_',
      metadata_name_field: 'name',
      row_threshold: 1000000,
      max_tables_scanned: 500,
    })
  },

  /** PRD §5.4.4 */
  getSchemaIntrospectionWindowedCountParamsJson: function () {
    return JSON.stringify({
      mode: 'windowed_count',
      table: 'syslog',
      filter: 'level=error',
      window_field: 'sys_created_on',
      window_hours: 24,
    })
  },

  runSyntheticSanityChecks: function () {
    var ok = true
    var s = this.syntheticDurationStatsHours([1, 2, 3, 4, 5])
    if (Math.abs(s.median - 3) > 0.0001) ok = false
    var r = this.syntheticRatioPercent(2, 10, 0)
    if (Math.abs(r - 20) > 0.0001) ok = false
    var r0 = this.syntheticRatioPercent(1, 0, 7)
    if (r0 !== 7) ok = false
    var gAvg = this.syntheticGroupedAggregate([0, 4, 8], 'avg')
    if (Math.abs(gAvg - 4) > 0.0001) ok = false
    var gMed = this.syntheticGroupedAggregate([1, 2, 3, 4], 'median')
    if (Math.abs(gMed - 2.5) > 0.0001) ok = false
    var gP90 = this.syntheticGroupedAggregate([10, 20, 30, 40], 'p90')
    if (gP90 === null || Math.abs(gP90 - 37) > 0.0001) ok = false
    var xt = this.syntheticRatioPercent(3, 12, 0)
    if (Math.abs(xt - 25) > 0.0001) ok = false
    gs.info('MAFCollectorTestFixtures: syntheticDurationStatsHours median(1..5)=' + s.median)
    gs.info('MAFCollectorTestFixtures: syntheticRatioPercent 2/10=' + r + ', empty den=' + r0)
    gs.info('MAFCollectorTestFixtures: syntheticGroupedAggregate avg[0,4,8]=' + gAvg + ', median=' + gMed + ', p90=' + gP90)
    gs.info('MAFCollectorTestFixtures: cross-table ratio 3/12=' + xt)
    return ok ? 'MAFCollectorTestFixtures: PASS' : 'MAFCollectorTestFixtures: FAIL'
  },

  _medianSorted: function (sorted) {
    var n = sorted.length
    var mid = Math.floor(n / 2)
    if (n % 2 === 1) return sorted[mid]
    return (sorted[mid - 1] + sorted[mid]) / 2
  },

  _percentileSorted: function (sorted, p) {
    var n = sorted.length
    if (n === 0) return null
    if (n === 1) return sorted[0]
    var idx = (p / 100) * (n - 1)
    var lo = Math.floor(idx)
    var hi = Math.ceil(idx)
    if (lo === hi) return sorted[lo]
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo)
  },

  type: 'MAFCollectorTestFixtures',
}
