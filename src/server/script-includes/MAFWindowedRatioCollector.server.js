gs.include('MAFMetricCollectorBase')

/**
 * Windowed percentage: COUNT(numerator_filter) / COUNT(denominator_filter) * 100 with optional
 * rolling window ({@code window_field} + {@code window_days}) applied to both queries.
 */
var MAFWindowedRatioCollector = Class.create()
MAFWindowedRatioCollector.prototype = Object.extendsObject(MAFMetricCollectorBase.prototype, {
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
    var table = String(p.table || '').trim()
    var numF = String(p.numerator_filter || '').trim()
    var denF = String(p.denominator_filter || '').trim()
    if (!table || !numF || !denF) {
      return {
        value: null,
        drillDownTable: null,
        drillDownQuery: null,
        error: 'table, numerator_filter, and denominator_filter are required',
      }
    }

    var grCheck = new GlideRecord(table)
    var windowField = p.window_field != null && String(p.window_field) !== '' ? String(p.window_field).trim() : ''
    var windowDays = p.window_days
    var hasWindow = windowField && windowDays !== null && typeof windowDays !== 'undefined' && String(windowDays) !== ''

    var windowClause = ''
    if (hasWindow) {
      var wd = parseInt(windowDays, 10)
      if (isNaN(wd) || wd < 1) {
        hasWindow = false
      } else {
        if (!grCheck.isValidField(windowField)) {
          return {
            value: null,
            drillDownTable: table,
            drillDownQuery: null,
            error: 'window_field is not valid on table ' + table,
          }
        }
        var cutoff = new GlideDateTime()
        cutoff.addDaysUTC(-wd)
        windowClause = '^' + windowField + '>=' + cutoff.getValue()
      }
    }

    var numQ = numF + windowClause
    var denQ = denF + windowClause

    var den = this._count(table, denQ)
    var emptyVal = p.empty_denominator_value
    if (emptyVal === null || typeof emptyVal === 'undefined') emptyVal = 0
    if (!den || den === 0) {
      return {
        value: Number(emptyVal),
        drillDownTable: table,
        drillDownQuery: numQ,
        error: null,
      }
    }
    var num = this._count(table, numQ)
    return {
      value: (num / den) * 100,
      drillDownTable: table,
      drillDownQuery: numQ,
      error: null,
    }
  },

  _count: function (table, encodedQuery) {
    var ga = new GlideAggregate(table)
    ga.addEncodedQuery(encodedQuery)
    ga.addAggregate('COUNT')
    ga.query()
    if (!ga.next()) return 0
    var v = ga.getAggregate('COUNT')
    return parseFloat(v) || 0
  },

  type: 'MAFWindowedRatioCollector',
})
