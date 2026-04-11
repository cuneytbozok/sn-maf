gs.include('MAFMetricCollectorBase')

/**
 * @deprecated Use {@link MAFDurationCollector} with `script_params` matching PRD §4.2 / {@link MAFCollectorTestFixtures#getMttrMigrationParamsJson}. Kept for backward compatibility.
 *
 * ITSM pack — mean time to resolve (hours) for incidents resolved in the last N days.
 * Uses {@link incident#opened_at} and {@link incident#resolved_at} when both are present.
 */
var ITSMMTTRCollector = Class.create()
ITSMMTTRCollector.prototype = Object.extendsObject(MAFMetricCollectorBase.prototype, {
  initialize: function (metricDefGR, assessmentRunGR) {
    MAFMetricCollectorBase.prototype.initialize.call(this, metricDefGR, assessmentRunGR)
  },

  collect: function () {
    try {
      return this._collectInternal()
    } catch (e) {
      return { value: null, drillDownTable: null, drillDownQuery: null, error: String(e) }
    }
  },

  _collectInternal: function () {
    var days = parseInt(this.params.window_days, 10)
    if (isNaN(days) || days < 1) days = 30

    var cutoff = new GlideDateTime()
    cutoff.addDaysUTC(-days)
    var q = 'resolved_at>=' + cutoff.getValue() + '^state=6^opened_atISNOTEMPTY^resolved_atISNOTEMPTY'

    var gr = new GlideRecord('incident')
    gr.addEncodedQuery(q)
    gr.query()

    var totalHours = 0
    var n = 0
    while (gr.next()) {
      var o = gr.getValue('opened_at')
      var r = gr.getValue('resolved_at')
      if (!o || !r) continue
      var gdo = new GlideDateTime(o)
      var gdr = new GlideDateTime(r)
      var ms = gdr.getNumericValue() - gdo.getNumericValue()
      if (ms < 0) continue
      totalHours += ms / 3600000
      n++
    }

    if (n === 0) {
      return { value: 0, drillDownTable: 'incident', drillDownQuery: q, error: null }
    }

    return {
      value: totalHours / n,
      drillDownTable: 'incident',
      drillDownQuery: q,
      error: null,
    }
  },

  type: 'ITSMMTTRCollector',
})
