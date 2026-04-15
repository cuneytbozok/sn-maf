gs.include('MAFMetricCollectorBase')

/**
 * Change Schedule Adherence — percentage of closed changes where actual work_start
 * is within tolerance_hours of planned start_date.
 *
 * script_params:
 *   tolerance_hours — max acceptable drift between start_date and work_start (default 24)
 */
var MAFChangeScheduleAdherenceCollector = Class.create()
MAFChangeScheduleAdherenceCollector.prototype = Object.extendsObject(MAFMetricCollectorBase.prototype, {
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
    var p = this.params || {}
    var toleranceHours = parseInt(p.tolerance_hours, 10)
    if (isNaN(toleranceHours) || toleranceHours < 1) toleranceHours = 24
    var toleranceMs = toleranceHours * 3600000

    var filter = 'state=3^start_dateISNOTEMPTY^work_startISNOTEMPTY'
    var gr = new GlideRecord('change_request')
    gr.addEncodedQuery(filter)
    gr.query()

    var total = 0
    var onSchedule = 0
    while (gr.next()) {
      total++
      var planned = new GlideDateTime(gr.getValue('start_date'))
      var actual = new GlideDateTime(gr.getValue('work_start'))
      var diffMs = Math.abs(actual.getNumericValue() - planned.getNumericValue())
      if (diffMs <= toleranceMs) {
        onSchedule++
      }
    }

    if (total === 0) {
      return {
        value: 0,
        drillDownTable: 'change_request',
        drillDownQuery: filter,
        error: null,
      }
    }

    return {
      value: (onSchedule / total) * 100,
      drillDownTable: 'change_request',
      drillDownQuery: filter,
      error: null,
    }
  },

  type: 'MAFChangeScheduleAdherenceCollector',
})
