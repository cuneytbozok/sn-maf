gs.include('MAFMetricCollectorBase')

/**
 * Reusable duration collector: stats on (end_field − start_field) with optional rolling window.
 * v1 supports unit minutes, hours, days. {@code business_hours} is not implemented (returns a clear error).
 *
 * Zero-duration rows are included in aggregates to match legacy {@link ITSMMTTRCollector} migration parity;
 * only negative durations are skipped.
 */
var MAFDurationCollector = Class.create()
MAFDurationCollector.prototype = Object.extendsObject(MAFMetricCollectorBase.prototype, {
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
    var startField = String(p.start_field || '').trim()
    var endField = String(p.end_field || '').trim()
    if (!table || !startField || !endField) {
      return { value: null, drillDownTable: null, drillDownQuery: null, error: 'table, start_field, and end_field are required' }
    }

    var unit = String(p.unit || 'hours').toLowerCase()
    if (unit === 'business_hours') {
      return {
        value: null,
        drillDownTable: table,
        drillDownQuery: null,
        error: 'unit=business_hours is not implemented in v1; use minutes, hours, or days',
      }
    }

    var gr = new GlideRecord(table)
    if (!gr.isValidField(startField) || !gr.isValidField(endField)) {
      return {
        value: null,
        drillDownTable: table,
        drillDownQuery: null,
        error: 'start_field or end_field not available on this instance',
      }
    }

    var windowField = String(p.window_field || endField || '').trim()
    var windowDays = p.window_days
    var hasWindow = windowDays !== null && typeof windowDays !== 'undefined' && String(windowDays) !== ''
    if (hasWindow) {
      var wd = parseInt(windowDays, 10)
      if (isNaN(wd) || wd < 1) hasWindow = false
      else {
        if (!gr.isValidField(windowField)) {
          return {
            value: null,
            drillDownTable: table,
            drillDownQuery: null,
            error: 'window_field is not valid on table ' + table,
          }
        }
      }
    }

    var filter = String(p.filter || '').trim()
    var parts = []
    if (filter) parts.push(filter)
    if (hasWindow) {
      var wdNum = parseInt(windowDays, 10)
      var cutoff = new GlideDateTime()
      cutoff.addDaysUTC(-wdNum)
      var cutoffStr = cutoff.getValue()
      parts.push(windowField + '>=' + cutoffStr)
    }
    parts.push(startField + 'ISNOTEMPTY')
    parts.push(endField + 'ISNOTEMPTY')
    var encoded = parts.join('^')

    var agg = String(p.aggregation || 'avg').toLowerCase()
    var maxSamples = 50000

    if (agg === 'avg' || agg === 'max' || agg === 'min' || agg === 'count') {
      return this._collectSinglePass(table, encoded, startField, endField, unit, agg)
    }
    if (agg === 'median' || agg === 'p90' || agg === 'p95') {
      return this._collectSorted(table, encoded, startField, endField, unit, agg, maxSamples)
    }
    return { value: null, drillDownTable: table, drillDownQuery: encoded, error: 'Unknown aggregation: ' + agg }
  },

  _msToUnit: function (ms, unit) {
    if (unit === 'minutes') return ms / 60000
    if (unit === 'days') return ms / 86400000
    return ms / 3600000
  },

  _collectSinglePass: function (table, encoded, startField, endField, unit, agg) {
    var gr = new GlideRecord(table)
    gr.addEncodedQuery(encoded)
    gr.query()
    var sum = 0
    var n = 0
    var minMs = null
    var maxMs = null
    while (gr.next()) {
      var o = gr.getValue(startField)
      var r = gr.getValue(endField)
      if (!o || !r) continue
      var gdo = new GlideDateTime(o)
      var gdr = new GlideDateTime(r)
      var ms = gdr.getNumericValue() - gdo.getNumericValue()
      if (ms < 0) continue
      n++
      if (agg === 'count') continue
      sum += ms
      if (minMs === null || ms < minMs) minMs = ms
      if (maxMs === null || ms > maxMs) maxMs = ms
    }
    if (n === 0) {
      if (agg === 'avg' || agg === 'count') {
        return { value: 0, drillDownTable: table, drillDownQuery: encoded, error: null }
      }
      return { value: null, drillDownTable: table, drillDownQuery: encoded, error: null }
    }
    if (agg === 'count') {
      return { value: n, drillDownTable: table, drillDownQuery: encoded, error: null }
    }
    if (agg === 'avg') {
      return { value: this._msToUnit(sum / n, unit), drillDownTable: table, drillDownQuery: encoded, error: null }
    }
    if (agg === 'min') {
      return { value: this._msToUnit(minMs, unit), drillDownTable: table, drillDownQuery: encoded, error: null }
    }
    if (agg === 'max') {
      return { value: this._msToUnit(maxMs, unit), drillDownTable: table, drillDownQuery: encoded, error: null }
    }
    return { value: null, drillDownTable: table, drillDownQuery: encoded, error: null }
  },

  _collectSorted: function (table, encoded, startField, endField, unit, agg, maxSamples) {
    var gr = new GlideRecord(table)
    gr.addEncodedQuery(encoded)
    gr.query()
    var values = []
    while (gr.next()) {
      var o = gr.getValue(startField)
      var r = gr.getValue(endField)
      if (!o || !r) continue
      var gdo = new GlideDateTime(o)
      var gdr = new GlideDateTime(r)
      var ms = gdr.getNumericValue() - gdo.getNumericValue()
      if (ms < 0) continue
      var v = this._msToUnit(ms, unit)
      values.push(v)
      if (values.length > maxSamples) {
        return {
          value: null,
          drillDownTable: table,
          drillDownQuery: encoded,
          error: 'duration aggregation exceeded 50000 records; narrow the filter or window',
        }
      }
    }
    var n = values.length
    if (n === 0) {
      return { value: null, drillDownTable: table, drillDownQuery: encoded, error: null }
    }
    values.sort(function (a, b) {
      return a - b
    })
    var out
    if (agg === 'median') {
      out = this._medianSorted(values)
    } else if (agg === 'p90') {
      out = this._percentileSorted(values, 90)
    } else {
      out = this._percentileSorted(values, 95)
    }
    return { value: out, drillDownTable: table, drillDownQuery: encoded, error: null }
  },

  _medianSorted: function (sorted) {
    var n = sorted.length
    if (n === 0) return null
    var mid = Math.floor(n / 2)
    if (n % 2 === 1) return sorted[mid]
    return (sorted[mid - 1] + sorted[mid]) / 2
  },

  _percentileSorted: function (sorted, p) {
    var n = sorted.length
    if (n === 0) return null
    if (n === 1) return sorted[0]
    var idx = (p / 100) * (n - 1)
    var lo = Math.floor(idx)
    var hi = Math.ceil(idx)
    if (lo === hi) return sorted[lo]
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo)
  },

  type: 'MAFDurationCollector',
})
