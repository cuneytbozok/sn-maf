/**
 * Business rule script for MAFManualResponseScorer.
 *
 * Fires on before update of x_maf_core_metric_result when a consultant answers
 * a manual (pending_input) metric by entering raw_value. Normalizes the value
 * against the parent metric_definition's thresholds, writes normalized_score +
 * rag_status + audit fields, then schedules a rollup refresh for the run.
 *
 * The rule is guarded to only act when:
 *   - result_mode === 'manual'
 *   - raw_value changed on this update
 *   - raw_value is non-null / non-empty
 *
 * Running as "before" lets us mutate current fields without a second save.
 * Rollup (scoreRun) is deferred to "after" via a short-lived flag so we only
 * recompute once per user save, not per field write.
 *
 * @param {GlideRecord} current
 * @param {GlideRecord} previous
 */
;(function (current, previous) {
  if (current.getValue('result_mode') !== 'manual') return
  if (!current.raw_value.changes()) return

  var rawStr = current.getValue('raw_value')
  if (rawStr === null || typeof rawStr === 'undefined' || String(rawStr) === '') return

  var raw = parseFloat(rawStr)
  if (isNaN(raw)) return

  var mdId = current.getValue('metric_definition')
  if (!mdId) return
  var mdGR = new GlideRecord('x_maf_core_metric_definition')
  if (!mdGR.get(mdId)) return

  var engine = new MAFScoringEngine()
  var norm = engine.normalize(raw, mdGR)

  current.setValue('normalized_score', norm.score)
  current.setValue('rag_status', norm.rag)
  current.setValue('manual_answered_by', gs.getUserID())
  current.setValue('manual_answered_at', new GlideDateTime())
  current.setValue('collection_error', '')

  // Defer the run-level rollup to an async job so the user's save returns
  // quickly and scoring runs off the hot path. Pass the run sys_id via
  // GlideScriptedProgressWorker when available; fall back to synchronous
  // rescore if the worker API is unreachable.
  var runId = current.getValue('assessment_run')
  if (!runId) return

  try {
    var w = new GlideScriptedProgressWorker()
    w.setProgressName('MAF manual answer rescore')
    w.setScriptIncludeName('MAFScoringEngine')
    w.setScriptIncludeMethod('scoreRun')
    if (typeof w.putMethodArg === 'function') w.putMethodArg('runSysId', runId)
    else if (typeof w.putParameter === 'function') w.putParameter('runSysId', runId)
    w.start()
  } catch (e) {
    gs.warn('MAFManualResponseScorer: background rescore unavailable, running synchronously: ' + e)
    try {
      engine.scoreRun(runId)
    } catch (e2) {
      gs.error('MAFManualResponseScorer: scoreRun failed for run ' + runId + ': ' + e2)
    }
  }
})(current, previous)
