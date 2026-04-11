gs.include('MAFMetricCollectorBase')

/**
 * ITSM pack — among incidents in the last N days whose {@code short_description} appears
 * at least 3 times in that window, the percentage that have {@link incident#problem_id} set.
 */
var ITSMRecurringProblemLinkCollector = Class.create()
ITSMRecurringProblemLinkCollector.prototype = Object.extendsObject(MAFMetricCollectorBase.prototype, {
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
    if (isNaN(days) || days < 1) days = 90

    var cutoff = new GlideDateTime()
    cutoff.addDaysUTC(-days)
    var timeQ = 'sys_created_on>=' + cutoff.getValue()

    var counts = {}
    var gr1 = new GlideRecord('incident')
    gr1.addEncodedQuery(timeQ)
    gr1.query()
    while (gr1.next()) {
      var sd = gr1.getValue('short_description')
      if (!sd) continue
      var k = String(sd)
      counts[k] = (counts[k] || 0) + 1
    }

    var total = 0
    var withProblem = 0
    var gr2 = new GlideRecord('incident')
    gr2.addEncodedQuery(timeQ)
    gr2.query()
    while (gr2.next()) {
      var sd2 = gr2.getValue('short_description')
      if (!sd2) continue
      if (counts[String(sd2)] < 3) continue
      total++
      if (gr2.getValue('problem_id')) withProblem++
    }

    if (total === 0) {
      return { value: 100, drillDownTable: 'incident', drillDownQuery: timeQ, error: null }
    }

    return {
      value: (withProblem / total) * 100,
      drillDownTable: 'incident',
      drillDownQuery: timeQ,
      error: null,
    }
  },

  type: 'ITSMRecurringProblemLinkCollector',
})
