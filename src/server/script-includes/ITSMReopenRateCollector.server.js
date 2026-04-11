gs.include('MAFMetricCollectorBase')

/**
 * @deprecated Use {@link MAFWindowedRatioCollector} with `script_params` matching PRD §4.3 / {@link MAFCollectorTestFixtures#getReopenMigrationParamsJson}. Kept for backward compatibility.
 *
 * ITSM pack — reopen rate (last N days).
 * Percentage of resolved incidents in the window with reopen_count > 0.
 * Requires incident.reopen_count; otherwise returns a clear collection error.
 */
var ITSMReopenRateCollector = Class.create()
ITSMReopenRateCollector.prototype = Object.extendsObject(MAFMetricCollectorBase.prototype, {
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

    var grCheck = new GlideRecord('incident')
    if (!grCheck.isValidField('reopen_count')) {
      return {
        value: null,
        drillDownTable: 'incident',
        drillDownQuery: null,
        error: 'incident.reopen_count is not available on this instance',
      }
    }

    var cutoff = new GlideDateTime()
    cutoff.addDaysUTC(-days)
    var cutoffStr = cutoff.getValue()

    var baseQ = 'resolved_at>=' + cutoffStr + '^state=6'
    var reopenedQ = baseQ + '^reopen_count>0'

    var den = this._countIncident(baseQ)
    if (!den || den === 0) {
      return { value: 0, drillDownTable: 'incident', drillDownQuery: baseQ, error: null }
    }
    var num = this._countIncident(reopenedQ)
    return {
      value: (num / den) * 100,
      drillDownTable: 'incident',
      drillDownQuery: reopenedQ,
      error: null,
    }
  },

  _countIncident: function (encodedQuery) {
    var ga = new GlideAggregate('incident')
    ga.addEncodedQuery(encodedQuery)
    ga.addAggregate('COUNT')
    ga.query()
    if (!ga.next()) return 0
    var v = ga.getAggregate('COUNT')
    return parseFloat(v) || 0
  },

  type: 'ITSMReopenRateCollector',
})
