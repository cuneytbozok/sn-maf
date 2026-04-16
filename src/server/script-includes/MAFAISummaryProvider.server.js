var MAFAISummaryProvider = Class.create()
MAFAISummaryProvider.prototype = {
  /**
   * Builds AI summary row for the run using configured provider (PRD §6.5).
   * @param {string} runSysId
   */
  generate: function (runSysId) {
    var payload = this._buildPayload(runSysId)
    var provider = gs.getProperty('x_maf_core.ai_provider', 'stub')
    var out
    var err = null
    try {
      if (provider === 'now_assist') out = this._generateNowAssist(payload)
      else if (provider === 'rest_llm') out = this._generateRestLLM(payload)
      else out = this._generateStub(payload)
    } catch (e) {
      err = String(e)
      out = this._generateStub(payload)
    }

    var writtenProvider = out.providerUsed || provider
    if (err) writtenProvider = 'stub'
    this._writeSummary(runSysId, writtenProvider, out.html, out.recommendations, err, out.tokenCount)
  },

  _writeSummary: function (runSysId, provider, html, recommendations, err, tokenCount) {
    var gr = new GlideRecord('x_maf_core_ai_summary')
    gr.addQuery('assessment_run', runSysId)
    gr.query()
    var recJson = JSON.stringify(recommendations || [])
    if (gr.next()) {
      gr.setValue('provider', provider)
      gr.setValue('executive_summary', html || '')
      gr.setValue('top_recommendations', recJson)
      gr.setValue('generated_at', new GlideDateTime())
      gr.setValue('error', err ? String(err).substring(0, 4000) : '')
      if (typeof tokenCount === 'number' && !isNaN(tokenCount)) gr.setValue('token_count', Math.floor(tokenCount))
      gr.update()
    } else {
      gr.initialize()
      gr.setValue('assessment_run', runSysId)
      gr.setValue('provider', provider)
      gr.setValue('executive_summary', html || '')
      gr.setValue('top_recommendations', recJson)
      gr.setValue('generated_at', new GlideDateTime())
      gr.setValue('error', err ? String(err).substring(0, 4000) : '')
      if (typeof tokenCount === 'number' && !isNaN(tokenCount)) gr.setValue('token_count', Math.floor(tokenCount))
      gr.insert()
    }
  },

  _dashboardGuidance: function () {
    return {
      scoring_model:
        'Each metric is normalized to 0-100 using its thresholds (red/amber/target). ' +
        'Sub-category scores are weighted averages of their metrics. ' +
        'Category scores are weighted averages of their sub-categories. ' +
        'RAG thresholds: green >= 75, amber >= 50, red < 50.',
      weight_interpretation:
        'Metric weight_in_category indicates its influence on the sub-category/category score. ' +
        'A red metric with weight 0.15 drags the score far more than one with weight 0.03. ' +
        'Focus remediation on high-weight red metrics for maximum score improvement.',
      rag_meaning: {
        green: 'At or near target — maintain current practices.',
        amber: 'Between red threshold and target — improvement needed but not critical.',
        red: 'Below red threshold — requires urgent attention.',
        error: 'Collection failed — metric could not be measured; investigate the error.',
      },
    }
  },

  _buildPayload: function (runSysId) {
    var run = new GlideRecord('x_maf_core_assessment_run')
    if (!run.get(runSysId))
      return { run: {}, packs: [], dashboard_guidance: this._dashboardGuidance() }

    var runObj = {
      number: run.getValue('number'),
      name: run.getValue('name'),
      started_at: String(run.getValue('started_at') || ''),
    }

    var packsRaw = run.getValue('packs') || ''
    var packIds = []
    var pr = String(packsRaw).split(',')
    for (var i = 0; i < pr.length; i++) {
      var id = String(pr[i]).trim()
      if (id) packIds.push(id)
    }

    var packsOut = []
    for (var p = 0; p < packIds.length; p++) {
      var pk = new GlideRecord('x_maf_core_pack')
      if (!pk.get(packIds[p])) continue
      var packName = pk.getValue('name')
      var packLabel = pk.getValue('label')

      var catGr = new GlideRecord('x_maf_core_category')
      catGr.addQuery('pack', packIds[p])
      catGr.orderBy('order')
      catGr.query()

      var categories = []
      while (catGr.next()) {
        var catId = catGr.getUniqueValue()
        var catName = catGr.getValue('name')
        var catLabel = catGr.getValue('label')
        var catWeight = parseFloat(catGr.getValue('weight'))

        var scoreVal = null
        var ragCat = ''
        var cs = new GlideRecord('x_maf_core_category_score')
        cs.addQuery('assessment_run', runSysId)
        cs.addQuery('category', catId)
        cs.query()
        if (cs.next()) {
          scoreVal = parseFloat(cs.getValue('score'))
          ragCat = cs.getValue('rag_status') || ''
        }

        var subCategoriesById = {}
        var subCategoriesOrdered = []
        var subGr = new GlideRecord('x_maf_core_sub_category')
        subGr.addQuery('category', catId)
        subGr.addQuery('active', true)
        subGr.orderBy('order')
        subGr.query()
        while (subGr.next()) {
          var subSysId = subGr.getUniqueValue()
          var subEntry = {
            name: subGr.getValue('name'),
            label: subGr.getValue('label'),
            weight_in_category: parseFloat(subGr.getValue('weight_in_category')),
            order: subGr.getValue('order'),
            score: null,
            rag: '',
            metrics_total: null,
            metrics_green: null,
            metrics_amber: null,
            metrics_red: null,
            metrics_error: null,
            metrics: [],
          }
          var scs = new GlideRecord('x_maf_core_sub_category_score')
          scs.addQuery('assessment_run', runSysId)
          scs.addQuery('sub_category', subSysId)
          scs.query()
          if (scs.next()) {
            var sv = scs.getValue('score')
            subEntry.score = sv != null && sv !== '' ? parseFloat(sv) : null
            subEntry.rag = scs.getValue('rag_status') || ''
            subEntry.metrics_total = scs.getValue('metrics_total')
            subEntry.metrics_green = scs.getValue('metrics_green')
            subEntry.metrics_amber = scs.getValue('metrics_amber')
            subEntry.metrics_red = scs.getValue('metrics_red')
            subEntry.metrics_error = scs.getValue('metrics_error')
          }
          subCategoriesById[subSysId] = subEntry
          subCategoriesOrdered.push(subEntry)
        }

        var metrics = []
        var uncategorized = []
        var md = new GlideRecord('x_maf_core_metric_definition')
        md.addQuery('category', catId)
        md.addQuery('active', true)
        md.query()
        while (md.next()) {
          var mid = md.getUniqueValue()
          var mr = new GlideRecord('x_maf_core_metric_result')
          mr.addQuery('assessment_run', runSysId)
          mr.addQuery('metric_definition', mid)
          mr.query()
          if (!mr.next()) continue
          var unit = md.getValue('unit') || ''
          var tv = md.getValue('target_value')
          var subRef = md.getValue('sub_category')
          var metricObj = {
            name: md.getValue('name'),
            label: md.getValue('label'),
            description: md.getValue('description') || '',
            value: mr.getValue('raw_value'),
            normalized: mr.getValue('normalized_score'),
            unit: unit,
            target: tv,
            threshold_red: md.getValue('threshold_red'),
            threshold_amber: md.getValue('threshold_amber'),
            higher_is_better: md.getValue('higher_is_better') === 'true' || md.getValue('higher_is_better') === '1',
            weight: md.getValue('weight_in_category'),
            rag: mr.getValue('rag_status'),
            collection_error: mr.getValue('collection_error') || null,
            drill_down_table: mr.getValue('drill_down_table') || null,
          }
          metrics.push(metricObj)
          if (subRef && subCategoriesById[subRef]) subCategoriesById[subRef].metrics.push(metricObj)
          else uncategorized.push(metricObj)
        }

        categories.push({
          name: catName,
          label: catLabel,
          weight: catWeight,
          score: scoreVal,
          rag: ragCat,
          sub_categories: subCategoriesOrdered,
          uncategorized_metrics: uncategorized,
          metrics: metrics,
        })
      }

      packsOut.push({
        name: packName,
        label: packLabel,
        categories: categories,
      })
    }

    return { run: runObj, packs: packsOut, dashboard_guidance: this._dashboardGuidance() }
  },

  _generateStub: function (payload) {
    var esc = function (s) {
      if (typeof GlideStringUtil !== 'undefined' && GlideStringUtil.escapeHTML) return GlideStringUtil.escapeHTML(String(s == null ? '' : s))
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
    }

    var html = []
    var recommendations = []

    html.push('<div class="maf-ai-stub-summary">')
    html.push('<h2>Assessment ' + esc(payload.run.number) + '</h2>')
    if (payload.run.name) html.push('<p><strong>' + esc(payload.run.name) + '</strong></p>')

    for (var pi = 0; pi < payload.packs.length; pi++) {
      var pack = payload.packs[pi]
      html.push('<h3>' + esc(pack.label || pack.name) + '</h3>')

      // ---- Overall RAG distribution across the pack ----
      var packTotals = { green: 0, amber: 0, red: 0, error: 0, total: 0 }
      for (var ci = 0; ci < pack.categories.length; ci++) {
        var cat = pack.categories[ci]
        for (var mi2 = 0; mi2 < cat.metrics.length; mi2++) {
          var m2 = cat.metrics[mi2]
          packTotals.total++
          if (m2.rag === 'green') packTotals.green++
          else if (m2.rag === 'amber') packTotals.amber++
          else if (m2.rag === 'red') packTotals.red++
          else if (m2.rag === 'error') packTotals.error++
        }
      }
      html.push(
        '<p><strong>Overall:</strong> ' + esc(packTotals.total) + ' metrics — ' +
        '<span style="color:#2e7d32">' + esc(packTotals.green) + ' green</span>, ' +
        '<span style="color:#f57f17">' + esc(packTotals.amber) + ' amber</span>, ' +
        '<span style="color:#c62828">' + esc(packTotals.red) + ' red</span>' +
        (packTotals.error > 0 ? ', <span style="color:#757575">' + esc(packTotals.error) + ' errors</span>' : '') +
        '</p>'
      )

      // ---- Category scoreboard ----
      html.push('<table style="border-collapse:collapse;width:100%;margin:8px 0 16px 0">')
      html.push('<thead><tr style="border-bottom:2px solid #ccc;text-align:left">')
      html.push('<th style="padding:4px 8px">Category</th><th style="padding:4px 8px">Weight</th>')
      html.push('<th style="padding:4px 8px">Score</th><th style="padding:4px 8px">RAG</th>')
      html.push('<th style="padding:4px 8px">Green</th><th style="padding:4px 8px">Amber</th><th style="padding:4px 8px">Red</th>')
      html.push('</tr></thead><tbody>')
      for (var ci2 = 0; ci2 < pack.categories.length; ci2++) {
        var cat2 = pack.categories[ci2]
        var catMetricTotals = { green: 0, amber: 0, red: 0 }
        for (var cmi = 0; cmi < cat2.metrics.length; cmi++) {
          var cmr = cat2.metrics[cmi].rag
          if (cmr === 'green') catMetricTotals.green++
          else if (cmr === 'amber') catMetricTotals.amber++
          else if (cmr === 'red') catMetricTotals.red++
        }
        var ragColor = cat2.rag === 'green' ? '#2e7d32' : cat2.rag === 'amber' ? '#f57f17' : '#c62828'
        html.push('<tr style="border-bottom:1px solid #eee">')
        html.push('<td style="padding:4px 8px"><strong>' + esc(cat2.label || cat2.name) + '</strong></td>')
        html.push('<td style="padding:4px 8px">' + esc(cat2.weight != null ? (cat2.weight * 100).toFixed(0) + '%' : '-') + '</td>')
        html.push('<td style="padding:4px 8px">' + esc(cat2.score != null ? cat2.score.toFixed(1) : 'n/a') + '</td>')
        html.push('<td style="padding:4px 8px;color:' + ragColor + '"><strong>' + esc(cat2.rag || 'n/a') + '</strong></td>')
        html.push('<td style="padding:4px 8px;color:#2e7d32">' + esc(catMetricTotals.green) + '</td>')
        html.push('<td style="padding:4px 8px;color:#f57f17">' + esc(catMetricTotals.amber) + '</td>')
        html.push('<td style="padding:4px 8px;color:#c62828">' + esc(catMetricTotals.red) + '</td>')
        html.push('</tr>')
      }
      html.push('</tbody></table>')

      // ---- Sub-category detail for non-green sub-categories ----
      var hasSubDetail = false
      for (var ci3 = 0; ci3 < pack.categories.length; ci3++) {
        var cat3 = pack.categories[ci3]
        var subs = cat3.sub_categories || []
        for (var si = 0; si < subs.length; si++) {
          var sub = subs[si]
          if (sub.rag === 'green') continue
          if (!hasSubDetail) {
            html.push('<h4>Sub-categories requiring attention</h4>')
            hasSubDetail = true
          }
          html.push(
            '<p><strong>' + esc(sub.label || sub.name) + '</strong>' +
            ' (' + esc(cat3.label) + ')' +
            ' — score ' + esc(sub.score != null ? sub.score.toFixed(1) : 'n/a') +
            ', <span style="color:' + (sub.rag === 'amber' ? '#f57f17' : '#c62828') + '">' + esc(sub.rag) + '</span>' +
            ' | ' + esc(sub.metrics_red || 0) + ' red, ' + esc(sub.metrics_amber || 0) + ' amber of ' + esc(sub.metrics_total || 0) + ' metrics</p>'
          )
        }
      }

      // ---- Top red metrics by weight (highest-impact problems) ----
      var allMetrics = []
      for (var ci4 = 0; ci4 < pack.categories.length; ci4++) {
        var cat4 = pack.categories[ci4]
        for (var mi3 = 0; mi3 < cat4.metrics.length; mi3++) {
          var mm = cat4.metrics[mi3]
          mm._categoryLabel = cat4.label || cat4.name
          mm._categoryWeight = cat4.weight
          allMetrics.push(mm)
        }
      }

      var redMetrics = []
      var amberMetrics = []
      var errorMetrics = []
      var greenMetrics = []
      for (var ai = 0; ai < allMetrics.length; ai++) {
        var am = allMetrics[ai]
        if (am.rag === 'red') redMetrics.push(am)
        else if (am.rag === 'amber') amberMetrics.push(am)
        else if (am.rag === 'error') errorMetrics.push(am)
        else if (am.rag === 'green') greenMetrics.push(am)
      }

      // Sort red and amber by weight descending (highest impact first)
      redMetrics.sort(function (a, b) { return parseFloat(b.weight || 0) - parseFloat(a.weight || 0) })
      amberMetrics.sort(function (a, b) { return parseFloat(b.weight || 0) - parseFloat(a.weight || 0) })

      if (redMetrics.length > 0) {
        var showRed = Math.min(redMetrics.length, 10)
        html.push('<h4>Critical metrics (red) — top ' + showRed + ' by weight</h4>')
        html.push('<table style="border-collapse:collapse;width:100%;margin:8px 0 12px 0">')
        html.push('<thead><tr style="border-bottom:2px solid #ccc;text-align:left">')
        html.push('<th style="padding:4px 8px">Metric</th><th style="padding:4px 8px">Category</th>')
        html.push('<th style="padding:4px 8px">Value</th><th style="padding:4px 8px">Target</th>')
        html.push('<th style="padding:4px 8px">Gap</th><th style="padding:4px 8px">Weight</th>')
        html.push('</tr></thead><tbody>')
        for (var ri = 0; ri < showRed; ri++) {
          var rm = redMetrics[ri]
          var gap = this._formatGap(rm)
          html.push('<tr style="border-bottom:1px solid #eee">')
          html.push('<td style="padding:4px 8px">' + esc(rm.label || rm.name) + '</td>')
          html.push('<td style="padding:4px 8px">' + esc(rm._categoryLabel) + '</td>')
          html.push('<td style="padding:4px 8px">' + esc(this._fmtVal(rm)) + '</td>')
          html.push('<td style="padding:4px 8px">' + esc(rm.target != null ? rm.target + (rm.unit || '') : '-') + '</td>')
          html.push('<td style="padding:4px 8px;color:#c62828"><strong>' + esc(gap) + '</strong></td>')
          html.push('<td style="padding:4px 8px">' + esc(rm.weight || '-') + '</td>')
          html.push('</tr>')
        }
        html.push('</tbody></table>')
      }

      if (amberMetrics.length > 0) {
        var showAmber = Math.min(amberMetrics.length, 7)
        html.push('<h4>Improvement needed (amber) — top ' + showAmber + ' by weight</h4>')
        html.push('<table style="border-collapse:collapse;width:100%;margin:8px 0 12px 0">')
        html.push('<thead><tr style="border-bottom:2px solid #ccc;text-align:left">')
        html.push('<th style="padding:4px 8px">Metric</th><th style="padding:4px 8px">Category</th>')
        html.push('<th style="padding:4px 8px">Value</th><th style="padding:4px 8px">Target</th>')
        html.push('<th style="padding:4px 8px">Weight</th>')
        html.push('</tr></thead><tbody>')
        for (var ami = 0; ami < showAmber; ami++) {
          var amm = amberMetrics[ami]
          html.push('<tr style="border-bottom:1px solid #eee">')
          html.push('<td style="padding:4px 8px">' + esc(amm.label || amm.name) + '</td>')
          html.push('<td style="padding:4px 8px">' + esc(amm._categoryLabel) + '</td>')
          html.push('<td style="padding:4px 8px">' + esc(this._fmtVal(amm)) + '</td>')
          html.push('<td style="padding:4px 8px">' + esc(amm.target != null ? amm.target + (amm.unit || '') : '-') + '</td>')
          html.push('<td style="padding:4px 8px">' + esc(amm.weight || '-') + '</td>')
          html.push('</tr>')
        }
        html.push('</tbody></table>')
      }

      // ---- Collection errors ----
      if (errorMetrics.length > 0) {
        html.push('<h4>Collection errors (' + esc(errorMetrics.length) + ' metrics)</h4>')
        html.push('<ul>')
        for (var ei = 0; ei < errorMetrics.length; ei++) {
          var em = errorMetrics[ei]
          var errText = em.collection_error ? ': ' + String(em.collection_error).substring(0, 200) : ''
          html.push('<li><strong>' + esc(em.label || em.name) + '</strong>' + esc(errText) + '</li>')
        }
        html.push('</ul>')
      }

      // ---- Strengths (top green by weight) ----
      greenMetrics.sort(function (a, b) { return parseFloat(b.weight || 0) - parseFloat(a.weight || 0) })
      if (greenMetrics.length > 0) {
        var showGreen = Math.min(greenMetrics.length, 5)
        html.push('<h4>Strengths — top ' + showGreen + ' green metrics by weight</h4>')
        html.push('<ul>')
        for (var gi = 0; gi < showGreen; gi++) {
          var gm = greenMetrics[gi]
          html.push(
            '<li><strong>' + esc(gm.label || gm.name) + '</strong>' +
            ' (' + esc(gm._categoryLabel) + ')' +
            ' — ' + esc(this._fmtVal(gm)) + ' (target: ' + esc(gm.target != null ? gm.target + (gm.unit || '') : '-') + ')</li>'
          )
        }
        html.push('</ul>')
      }

      // ---- Build recommendations from red metrics grouped by sub-category ----
      var subBuckets = {}
      for (var rri = 0; rri < redMetrics.length; rri++) {
        var rrm = redMetrics[rri]
        var bucketKey = rrm._categoryLabel
        if (!subBuckets[bucketKey]) subBuckets[bucketKey] = { metrics: [], totalWeight: 0 }
        subBuckets[bucketKey].metrics.push(rrm)
        subBuckets[bucketKey].totalWeight += parseFloat(rrm.weight || 0)
      }

      var bucketKeys = Object.keys(subBuckets)
      bucketKeys.sort(function (a, b) { return subBuckets[b].totalWeight - subBuckets[a].totalWeight })
      var recCount = Math.min(bucketKeys.length, 5)
      for (var bki = 0; bki < recCount; bki++) {
        var bk = bucketKeys[bki]
        var bucket = subBuckets[bk]
        var topNames = []
        var topLabels = []
        for (var tni = 0; tni < Math.min(bucket.metrics.length, 3); tni++) {
          topNames.push(bucket.metrics[tni].name)
          topLabels.push(bucket.metrics[tni].label || bucket.metrics[tni].name)
        }
        recommendations.push({
          title: 'Address red metrics in ' + bk,
          rationale: bucket.metrics.length + ' red metric(s) with combined weight ' +
            bucket.totalWeight.toFixed(2) + '. Top offenders: ' +
            topLabels.join(', ') + '.',
          effort: bucket.totalWeight > 0.2 ? 'high' : 'medium',
          impact: 'high',
          related_metrics: topNames,
        })
      }

      // Add a recommendation for errors if present
      if (errorMetrics.length > 0) {
        var errNames = []
        for (var eni = 0; eni < Math.min(errorMetrics.length, 5); eni++) {
          errNames.push(errorMetrics[eni].name)
        }
        recommendations.push({
          title: 'Resolve ' + errorMetrics.length + ' collection errors',
          rationale: 'Metrics with collection errors are excluded from scoring, creating blind spots in the assessment.',
          effort: 'low',
          impact: 'medium',
          related_metrics: errNames,
        })
      }
    }

    html.push('<p class="text-muted">Generated by MAF stub AI provider (configure x_maf_core.ai_provider for Now Assist or REST).</p>')
    html.push('</div>')

    return { html: html.join(''), recommendations: recommendations, providerUsed: 'stub', error: null, tokenCount: null }
  },

  _formatGap: function (metric) {
    var val = parseFloat(metric.value)
    var target = parseFloat(metric.target)
    if (isNaN(val) || isNaN(target)) return '-'
    var diff = metric.higher_is_better ? target - val : val - target
    if (diff <= 0) return 'at target'
    var unit = metric.unit || ''
    if (unit === '%') return '+' + diff.toFixed(1) + '% to go'
    if (unit === 'hours') return diff.toFixed(1) + 'h over'
    return diff.toFixed(1) + ' ' + unit + ' gap'
  },

  _fmtVal: function (metric) {
    var v = metric.value
    if (v == null || v === '') return 'n/a'
    var n = parseFloat(v)
    if (isNaN(n)) return String(v)
    var unit = metric.unit || ''
    if (unit === '%') return n.toFixed(1) + '%'
    if (unit === 'hours') return n.toFixed(1) + 'h'
    if (unit === 'count') return Math.round(n).toString()
    return n.toFixed(2) + (unit ? ' ' + unit : '')
  },

  /**
   * System + user text and the same structured payload sent to LLMs (OpenAI-style chat).
   * @param {Object} payload from _buildPayload
   */
  buildPromptEnvelope: function (payload) {
    return this._buildPromptEnvelope(payload)
  },

  _buildPromptEnvelope: function (payload) {
    // Build a compact payload for the LLM to stay within token limits.
    // The full payload (with descriptions, thresholds, sub-category nesting, guidance)
    // is still used by _generateStub. Here we strip it down to essentials.
    var compact = { run: payload.run, packs: [] }
    for (var pi2 = 0; pi2 < payload.packs.length; pi2++) {
      var pk2 = payload.packs[pi2]
      var compactCats = []
      for (var ci2 = 0; ci2 < pk2.categories.length; ci2++) {
        var ct = pk2.categories[ci2]
        var compactMetrics = []
        for (var mi3 = 0; mi3 < ct.metrics.length; mi3++) {
          var mx = ct.metrics[mi3]
          var cm = {
            name: mx.name,
            label: mx.label,
            value: mx.value,
            target: mx.target,
            unit: mx.unit,
            rag: mx.rag,
            weight: mx.weight,
            higher_is_better: mx.higher_is_better,
            normalized: mx.normalized,
          }
          if (mx.collection_error) cm.collection_error = mx.collection_error
          compactMetrics.push(cm)
        }
        compactCats.push({
          name: ct.name,
          label: ct.label,
          weight: ct.weight,
          score: ct.score,
          rag: ct.rag,
          metrics: compactMetrics,
        })
      }
      compact.packs.push({ name: pk2.name, label: pk2.label, categories: compactCats })
    }
    var jsonStr = JSON.stringify(compact)

    var system =
      'You are an expert ServiceNow platform maturity advisor analyzing results from the Maturity Assessment Framework (MAF). ' +
      'You receive structured JSON containing packs, categories (with weights), sub-categories, and per-metric results including raw values, normalized scores (0-100), RAG status, thresholds, targets, weights, and descriptions.\n\n' +
      'KEY CONCEPTS:\n' +
      '- Each metric has two identifiers: "label" (human-readable display title, e.g. "Business service governance fields populated (%)") and "name" (machine id, e.g. "svc_gov_business_service_fields").\n' +
      '- Each metric has a weight_in_category that determines its influence on the rollup score. High-weight red metrics are the biggest problems.\n' +
      '- higher_is_better=true means the raw value should be high (e.g., % populated). false means it should be low (e.g., error count, hours).\n' +
      '- The gap between current value and target quantifies the improvement needed.\n' +
      '- Category weight determines how much each category contributes to overall maturity.\n' +
      '- Collection errors (rag=error) mean the metric could not be measured — these are blind spots.\n\n' +
      'ANALYSIS RULES:\n' +
      '- Always quantify: use actual values, targets, and gaps — never say "some metrics are red" without naming them and their numbers.\n' +
      '- Prioritize by weight: a red metric with weight 0.15 matters 5x more than one with weight 0.03.\n' +
      '- Group related findings: if multiple CI-linkage metrics are red, discuss them together as a CMDB data quality theme.\n' +
      '- Call out strengths: identify what is going well (green metrics with high weights) — stakeholders need balanced perspective.\n' +
      '- For errors: explain what failed and why it matters (blind spots in scoring).\n' +
      '- ALWAYS use the metric "label" field (not "name") for every user-facing reference in the HTML output — tables, bullet lists, prose. The "name" field is an internal id and must NEVER appear in the rendered HTML. Same rule applies to category and sub_category: use their "label" fields in the HTML.\n' +
      '- The "name" field is reserved for the related_metrics array in the Recommendations JSON only.\n' +
      '- Do not invent metrics, scores, or data not present in the JSON.'

    var user =
      'Analyze the MAF assessment JSON below and produce TWO outputs:\n\n' +
      '## OUTPUT 1: Executive HTML Summary\n' +
      'Wrap in <div class="maf-ai-llm-summary">. Every metric, category, and sub-category mentioned in the HTML MUST be referenced by its "label" field, never its "name" field. Structure as:\n\n' +
      '1. **Overall health snapshot** — one paragraph with total metrics, RAG distribution, and overall maturity posture.\n\n' +
      '2. **Category scorecard** — for each category, state: score, RAG, weight, and the key driver (best and worst sub-category). Use an HTML table. Show category and sub-category labels, not names.\n\n' +
      '3. **Critical findings (red metrics)** — list the top 10 red metrics sorted by weight (highest impact first). For each: the metric label, current value vs target, gap, and a one-line explanation of business impact using the metric description. Use an HTML table with columns: Metric, Value, Target, Gap, Impact. The Metric column MUST show the label (e.g. "Business service governance fields populated (%)"), not the name (e.g. "svc_gov_business_service_fields").\n\n' +
      '4. **Improvement opportunities (amber metrics)** — top 5-7 amber metrics by weight with value vs target. Brief table. Show labels, not names.\n\n' +
      '5. **Strengths** — top 5 green metrics by weight (show labels). Recognize what the organization does well.\n\n' +
      '6. **Collection errors** — if any metrics have rag=error, list them (by label) with the collection_error message and explain the blind spot.\n\n' +
      '7. **Cross-cutting themes** — identify 2-3 patterns across metrics (e.g., "CMDB linkage is weak across incident, problem, and change" or "Knowledge management shows strong freshness but low attachment at resolve").\n\n' +
      '## OUTPUT 2: Recommendations JSON\n' +
      'After the HTML, output one fenced JSON code block ```json ... ``` containing:\n' +
      '{ "recommendations": [ { "title": "...", "rationale": "...", "effort": "low|medium|high", "impact": "low|medium|high", "related_metrics": ["metric_name1", ...], "related_sub_category": "sub_cat_name" } ] }\n\n' +
      'Provide 5-8 recommendations. Prioritize by (impact * weight). Each recommendation should:\n' +
      '- Have a specific, actionable title that uses the metric label (not "improve data quality" but "Populate CI field on incidents — currently at 45% vs 90% target"). Never put metric "name" ids in the title or rationale.\n' +
      '- Reference specific metric values and gaps in the rationale, using labels when mentioning metrics.\n' +
      '- Use metric "name" values from the JSON for the related_metrics array (this is the only place names belong — it is a machine-readable id list, not display text).\n\n' +
      'Assessment JSON:\n' +
      jsonStr

    return { system: system, user: user }
  },

  _buildChatRequestBody: function (env) {
    var model = gs.getProperty('x_maf_core.rest_llm_model', 'gpt-4o-mini')
    return {
      model: model,
      messages: [
        { role: 'system', content: env.system },
        { role: 'user', content: env.user },
      ],
      temperature: 0.35,
    }
  },

  _parseOpenAiChatResponse: function (respBody) {
    var body = JSON.parse(respBody)
    var usage = body.usage || {}
    var tokenCount = usage.total_tokens
    var content = body.choices && body.choices[0] && body.choices[0].message && body.choices[0].message.content
    content = String(content || '')
    return {
      html: this._extractHtmlFromLlmContent(content),
      recommendations: this._extractRecommendationsFromLlmContent(content),
      tokenCount: typeof tokenCount === 'number' && !isNaN(tokenCount) ? tokenCount : null,
    }
  },

  _extractRecommendationsFromLlmContent: function (content) {
    var m = content.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (!m) return []
    try {
      var j = JSON.parse(m[1].trim())
      if (j.recommendations && j.recommendations.length) return j.recommendations
      if (Array.isArray(j)) return j
    } catch (e) {}
    return []
  },

  _extractHtmlFromLlmContent: function (content) {
    // LLMs often wrap HTML in ```html ... ``` fences — extract the inner content.
    // Strategy: find all fenced blocks, identify the HTML block (non-json), and use it.
    // If no fences, treat the whole content (minus any trailing json fence) as the summary.
    var main = ''
    var fencePattern = /```(\w*)\s*\n?([\s\S]*?)```/g
    var match
    var blocks = []
    while ((match = fencePattern.exec(content)) !== null) {
      blocks.push({ lang: (match[1] || '').toLowerCase(), body: match[2].trim() })
    }

    if (blocks.length > 0) {
      // Look for an html-tagged block first
      for (var i = 0; i < blocks.length; i++) {
        if (blocks[i].lang === 'html') { main = blocks[i].body; break }
      }
      // If no html block, use the first non-json block
      if (!main) {
        for (var j = 0; j < blocks.length; j++) {
          if (blocks[j].lang !== 'json') { main = blocks[j].body; break }
        }
      }
      // If still empty, take any text before the first fence
      if (!main) {
        var firstFence = content.indexOf('```')
        main = content.substring(0, firstFence).trim()
      }
    } else {
      // No fences at all — use the whole content
      main = content.trim()
    }

    if (!main) main = '<p>(No summary text returned — the LLM response could not be parsed.)</p>'

    // Ensure it is wrapped in a container div
    if (main.indexOf('<') < 0)
      main = '<div class="maf-ai-llm-summary">' + main.replace(/\n/g, '<br/>') + '</div>'
    else if (main.indexOf('maf-ai-llm-summary') < 0 && main.indexOf('<div') < 0)
      main = '<div class="maf-ai-llm-summary">' + main + '</div>'
    return main
  },

  /**
   * TODO: Invoke Now Assist Skill Kit skill `x_maf_core_summarize_assessment` when licensed and configured.
   */
  _generateNowAssist: function (payload) {
    throw new Error('Skill Kit integration not yet configured (skill x_maf_core_summarize_assessment).')
  },

  /**
   * POST OpenAI-compatible chat completions when x_maf_core.rest_llm_chat_url is set; otherwise stub if a REST message record exists (legacy), else throw.
   */
  _generateRestLLM: function (payload) {
    var env = this._buildPromptEnvelope(payload)
    var url = String(gs.getProperty('x_maf_core.rest_llm_chat_url', '') || '').trim()
    var apiKey = gs.getProperty('x_maf_core.rest_llm_api_key', '') || ''
    if (url) {
      var bodyObj = this._buildChatRequestBody(env)
      var bodyStr = JSON.stringify(bodyObj)
      var req = new sn_ws.RESTMessageV2()
      req.setEndpoint(url)
      req.setHttpMethod('post')
      req.setRequestHeader('Content-Type', 'application/json')
      if (String(apiKey).trim() !== '') req.setRequestHeader('Authorization', 'Bearer ' + apiKey)
      req.setHttpTimeout(120000)
      req.setRequestBody(bodyStr)
      var res = req.execute()
      var code = res.getStatusCode()
      var respBody = res.getBody()
      if (code < 200 || code >= 300)
        throw new Error('REST LLM HTTP ' + code + ': ' + String(respBody).substring(0, 1500))
      var parsed = this._parseOpenAiChatResponse(respBody)
      return {
        html: parsed.html,
        recommendations: parsed.recommendations,
        providerUsed: 'rest_llm',
        error: null,
        tokenCount: parsed.tokenCount,
      }
    }
    var rmName = gs.getProperty('x_maf_core.rest_llm_message', 'x_maf_core_llm_generate')
    var rm = new GlideRecord('sys_rest_message')
    rm.addQuery('name', rmName)
    rm.query()
    if (!rm.hasNext()) {
      throw new Error(
        'REST LLM not configured: set system properties x_maf_core.rest_llm_chat_url (and optionally rest_llm_api_key, rest_llm_model), or create REST message ' +
          rmName +
          ' and extend this script include to invoke it.'
      )
    }
    var s = this._generateStub(payload)
    s.providerUsed = 'rest_llm'
    return s
  },

  type: 'MAFAISummaryProvider',
}
