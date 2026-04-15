// Normalization helpers — keep in sync with src/pure/mafNormalize.js (npm test)

function mafRound2(n) {
  return Math.round(Number(n) * 100) / 100
}

function mafNormalizeHigherIsBetter(raw, tr, ta, tv) {
  if (raw <= tr) {
    if (tr > 0) return Math.max(0, Math.min(33, (33 * raw) / tr))
    return raw <= 0 ? 0 : 33
  }
  if (raw <= ta) {
    if (ta > tr) return 34 + ((66 - 34) * (raw - tr)) / (ta - tr)
    return 50
  }
  if (raw >= tv) return 100
  if (tv > ta) return 67 + ((99 - 67) * (raw - ta)) / (tv - ta)
  return 83
}

function mafNormalizeLowerIsBetter(raw, tr, ta, tv) {
  if (raw <= tv) return 100
  if (raw < ta) {
    if (ta > tv) return 67 + ((99 - 67) * (raw - tv)) / (ta - tv)
    return 83
  }
  if (raw < tr) {
    if (tr > ta) return 34 + ((66 - 34) * (raw - ta)) / (tr - ta)
    return 50
  }
  if (raw > 0) return Math.max(0, Math.min(33, (33 * tr) / raw))
  return 0
}

function mafMetricRagFromRaw(raw, tr, ta, higherIsBetter) {
  if (higherIsBetter) {
    if (raw <= tr) return 'red'
    if (raw >= ta) return 'green'
    return 'amber'
  }
  if (raw >= tr) return 'red'
  if (raw <= ta) return 'green'
  return 'amber'
}

function mafNormalizeMetricScore(raw, thresholdRed, thresholdAmber, targetValue, higherIsBetter) {
  var r = Number(raw)
  var tr = Number(thresholdRed)
  var ta = Number(thresholdAmber)
  var tv = Number(targetValue)
  var hib = higherIsBetter === true || higherIsBetter === 'true' || higherIsBetter === '1' || higherIsBetter === 1

  var score
  if (hib) {
    score = mafNormalizeHigherIsBetter(r, tr, ta, tv)
  } else {
    score = mafNormalizeLowerIsBetter(r, tr, ta, tv)
  }

  var rag = mafMetricRagFromRaw(r, tr, ta, hib)
  return { score: mafRound2(score), rag: rag }
}

var MAFScoringEngine = Class.create()
MAFScoringEngine.prototype = {
  /**
   * @param {number|string} raw
   * @param {GlideRecord} metricDefGR x_maf_core_metric_definition
   * @returns {{ score: number, rag: string }}
   */
  normalize: function (raw, metricDefGR) {
    var tr = parseFloat(metricDefGR.getValue('threshold_red'))
    var ta = parseFloat(metricDefGR.getValue('threshold_amber'))
    var tv = parseFloat(metricDefGR.getValue('target_value'))
    var hibV = metricDefGR.getValue('higher_is_better')
    var hib = true
    if (hibV === 'false' || hibV === '0') hib = false
    return mafNormalizeMetricScore(raw, tr, ta, tv, hib)
  },

  /**
   * Rebuilds sub-category and category scores (PRD §4.3 two-pass rollup).
   * @param {string} runSysId
   */
  scoreRun: function (runSysId) {
    var run = new GlideRecord('x_maf_core_assessment_run')
    if (!run.get(runSysId)) return

    var delSub = new GlideRecord('x_maf_core_sub_category_score')
    delSub.addQuery('assessment_run', runSysId)
    delSub.query()
    delSub.deleteMultiple()

    var delCat = new GlideRecord('x_maf_core_category_score')
    delCat.addQuery('assessment_run', runSysId)
    delCat.query()
    delCat.deleteMultiple()

    var packsRaw = run.getValue('packs')
    if (!packsRaw) return

    var packIds = []
    var parts = String(packsRaw).split(',')
    for (var i = 0; i < parts.length; i++) {
      var p = String(parts[i]).trim()
      if (p) packIds.push(p)
    }
    if (packIds.length === 0) return

    var greenTh = parseInt(gs.getProperty('x_maf_core.score_threshold_green', '75'), 10)
    var amberTh = parseInt(gs.getProperty('x_maf_core.score_threshold_amber', '50'), 10)
    if (isNaN(greenTh)) greenTh = 75
    if (isNaN(amberTh)) amberTh = 50

    var subCatAggregates = {}

    var mr = new GlideRecord('x_maf_core_metric_result')
    mr.addQuery('assessment_run', runSysId)
    mr.query()
    while (mr.next()) {
      var mdId = mr.getValue('metric_definition')
      var mdGR = new GlideRecord('x_maf_core_metric_definition')
      if (!mdGR.get(mdId)) continue

      var subCatId = mdGR.getValue('sub_category')
      if (!subCatId) continue

      if (!subCatAggregates[subCatId]) {
        subCatAggregates[subCatId] = {
          wSum: 0,
          weighted: 0,
          total: 0,
          green: 0,
          amber: 0,
          red: 0,
          error: 0,
        }
      }
      var agg = subCatAggregates[subCatId]
      agg.total++

      var rs = mr.getValue('rag_status')
      if (rs === 'error') {
        agg.error++
        continue
      }
      if (rs === 'green') agg.green++
      else if (rs === 'amber') agg.amber++
      else if (rs === 'red') agg.red++

      var w = parseFloat(mdGR.getValue('weight_in_category'))
      if (isNaN(w) || w === 0) continue

      var ns = parseFloat(mr.getValue('normalized_score'))
      if (isNaN(ns)) continue

      agg.weighted += ns * w
      agg.wSum += w
    }

    var catAggregates = {}

    var subGr = new GlideRecord('x_maf_core_sub_category')
    subGr.addQuery('category.pack', 'IN', packIds.join(','))
    subGr.addQuery('active', true)
    subGr.query()
    while (subGr.next()) {
      var subId = subGr.getUniqueValue()
      var catId = subGr.getValue('category')
      var agg = subCatAggregates[subId]

      if (!agg || agg.total === 0) continue

      var subScore = agg.wSum > 0 ? mafRound2(agg.weighted / agg.wSum) : 0
      var subRag = 'red'
      if (subScore >= greenTh) subRag = 'green'
      else if (subScore >= amberTh) subRag = 'amber'

      var cs = new GlideRecord('x_maf_core_sub_category_score')
      cs.initialize()
      cs.setValue('assessment_run', runSysId)
      cs.setValue('sub_category', subId)
      cs.setValue('score', subScore)
      cs.setValue('rag_status', subRag)
      cs.setValue('metrics_total', agg.total)
      cs.setValue('metrics_green', agg.green)
      cs.setValue('metrics_amber', agg.amber)
      cs.setValue('metrics_red', agg.red)
      cs.setValue('metrics_error', agg.error)
      cs.insert()

      if (!catAggregates[catId]) {
        catAggregates[catId] = {
          wSum: 0,
          weighted: 0,
          total: 0,
          green: 0,
          amber: 0,
          red: 0,
          error: 0,
        }
      }
      var cAgg = catAggregates[catId]
      var subW = parseFloat(subGr.getValue('weight_in_category'))
      if (isNaN(subW) || subW === 0) subW = 0

      cAgg.weighted += subScore * subW
      cAgg.wSum += subW
      cAgg.total += agg.total
      cAgg.green += agg.green
      cAgg.amber += agg.amber
      cAgg.red += agg.red
      cAgg.error += agg.error
    }

    var catGr = new GlideRecord('x_maf_core_category')
    catGr.addQuery('pack', 'IN', packIds.join(','))
    catGr.query()
    while (catGr.next()) {
      var catId2 = catGr.getUniqueValue()
      var cAgg2 = catAggregates[catId2]
      if (!cAgg2) continue

      var catScore = cAgg2.wSum > 0 ? mafRound2(cAgg2.weighted / cAgg2.wSum) : 0
      var catRag = 'red'
      if (catScore >= greenTh) catRag = 'green'
      else if (catScore >= amberTh) catRag = 'amber'

      var cs2 = new GlideRecord('x_maf_core_category_score')
      cs2.initialize()
      cs2.setValue('assessment_run', runSysId)
      cs2.setValue('category', catId2)
      cs2.setValue('score', catScore)
      cs2.setValue('rag_status', catRag)
      cs2.setValue('metrics_total', cAgg2.total)
      cs2.setValue('metrics_green', cAgg2.green)
      cs2.setValue('metrics_amber', cAgg2.amber)
      cs2.setValue('metrics_red', cAgg2.red)
      cs2.setValue('metrics_error', cAgg2.error)
      cs2.insert()
    }
  },

  type: 'MAFScoringEngine',
}
