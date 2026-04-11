/**
 * Pure 0–100 normalization + metric RAG from PRD §6.4.
 * Keep algorithm aligned with MAFScoringEngine.server.js on the instance.
 */
function mafRound2(n) {
  return Math.round(Number(n) * 100) / 100
}

/**
 * @param {number} raw
 * @param {number} thresholdRed
 * @param {number} thresholdAmber
 * @param {number} targetValue
 * @param {boolean} higherIsBetter
 * @returns {{ score: number, rag: 'red'|'amber'|'green' }}
 */
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    mafNormalizeMetricScore,
    mafMetricRagFromRaw,
    mafNormalizeHigherIsBetter,
    mafNormalizeLowerIsBetter,
  }
}
