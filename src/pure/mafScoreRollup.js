/**
 * Pure sub-category → category rollup (PRD §4.3). Mirrors MAFScoringEngine.scoreRun math
 * for unit tests without GlideRecord.
 */

function mafRound2(n) {
  return Math.round(Number(n) * 100) / 100
}

/**
 * @typedef {{ wSum: number, weighted: number, total: number, green: number, amber: number, red: number, error: number }} SubAgg
 */

/**
 * First pass: metric results → aggregates keyed by sub-category sys_id.
 * Skips rows with null sub_category, error RAG from weighted sum (errors still increment total/error).
 *
 * @param {Array<{ metricDefinitionId: string, ragStatus: string, normalizedScore: number | null }>} metricResults
 * @param {Record<string, { subCategoryId: string | null, weight: number }>} defsByMetricId
 * @returns {Record<string, SubAgg>}
 */
export function mafAggregateSubCategories(metricResults, defsByMetricId) {
  /** @type {Record<string, SubAgg>} */
  const subCatAggregates = {}

  for (const mr of metricResults) {
    const def = defsByMetricId[mr.metricDefinitionId]
    if (!def) continue

    const subCatId = def.subCategoryId
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
    const agg = subCatAggregates[subCatId]
    agg.total++

    const rs = mr.ragStatus
    if (rs === 'error') {
      agg.error++
      continue
    }
    if (rs === 'green') agg.green++
    else if (rs === 'amber') agg.amber++
    else if (rs === 'red') agg.red++

    const w = def.weight
    if (Number.isNaN(w) || w === 0) continue

    const ns = mr.normalizedScore
    if (ns === null || ns === undefined || Number.isNaN(Number(ns))) continue

    agg.weighted += Number(ns) * w
    agg.wSum += w
  }

  return subCatAggregates
}

/**
 * @param {SubAgg} agg
 * @param {number} greenTh
 * @param {number} amberTh
 * @returns {{ score: number, rag: 'green'|'amber'|'red' }}
 */
export function mafSubCategoryScoreFromAgg(agg, greenTh, amberTh) {
  const subScore = agg.wSum > 0 ? mafRound2(agg.weighted / agg.wSum) : 0
  let subRag = 'red'
  if (subScore >= greenTh) subRag = 'green'
  else if (subScore >= amberTh) subRag = 'amber'
  return { score: subScore, rag: subRag }
}

/**
 * Accumulate category-level weighted sums from sub-category scores.
 *
 * @param {Record<string, { categoryId: string, weightInCategory: number }>} subMetaById
 * @param {Record<string, SubAgg>} subAggs
 * @param {number} greenTh
 * @param {number} amberTh
 * @returns {Record<string, { wSum: number, weighted: number, total: number, green: number, amber: number, red: number, error: number }>}
 */
export function mafRollSubScoresIntoCategories(subMetaById, subAggs, greenTh, amberTh) {
  /** @type {Record<string, { wSum: number, weighted: number, total: number, green: number, amber: number, red: number, error: number }>} */
  const catAggregates = {}

  for (const subId of Object.keys(subMetaById)) {
    const meta = subMetaById[subId]
    const agg = subAggs[subId]
    if (!agg || agg.total === 0) continue

    const { score: subScore } = mafSubCategoryScoreFromAgg(agg, greenTh, amberTh)
    const catId = meta.categoryId
    let subW = meta.weightInCategory
    if (Number.isNaN(subW) || subW === 0) subW = 0

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
    const cAgg = catAggregates[catId]
    cAgg.weighted += subScore * subW
    cAgg.wSum += subW
    cAgg.total += agg.total
    cAgg.green += agg.green
    cAgg.amber += agg.amber
    cAgg.red += agg.red
    cAgg.error += agg.error
  }

  return catAggregates
}

/**
 * @param {{ wSum: number, weighted: number }} cAgg
 * @param {number} greenTh
 * @param {number} amberTh
 */
export function mafCategoryScoreFromAgg(cAgg, greenTh, amberTh) {
  const catScore = cAgg.wSum > 0 ? mafRound2(cAgg.weighted / cAgg.wSum) : 0
  let catRag = 'red'
  if (catScore >= greenTh) catRag = 'green'
  else if (catScore >= amberTh) catRag = 'amber'
  return { score: catScore, rag: catRag }
}

export { mafRound2 }
