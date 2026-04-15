gs.include('MAFMetricCollectorBase')

/**
 * AVG / median / p90 / max / min of per-parent child counts (PRD §5.3).
 */
var MAFGroupedAverageCollector = Class.create()
MAFGroupedAverageCollector.prototype = Object.extendsObject(MAFMetricCollectorBase.prototype, {
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
    var childTable = String(p.child_table || '').trim()
    var parentField = String(p.parent_field || '').trim()
    var parentTable = String(p.parent_table || '').trim()
    var childFilter = p.child_filter != null ? String(p.child_filter) : ''
    var parentFilter = p.parent_filter != null ? String(p.parent_filter) : ''
    if (p.portal_catalog_scope === true || p.portal_catalog_scope === 'true') {
      if (parentTable === 'sc_cat_item') {
        if (!gs.include('MAFPortalScopeHelper')) {
          return {
            value: null,
            drillDownTable: null,
            drillDownQuery: null,
            error: 'MAFPortalScopeHelper not found',
          }
        }
        var h = MAFPortalScopeHelper
        var sr = h.getPortalCatItemScope()
        if (!sr.catItemScope) {
          return { value: null, drillDownTable: null, drillDownQuery: null, error: 'portal_catalog_scope: ' + sr.error }
        }
        parentFilter = h.mergeQueries(sr.catItemScope, parentFilter)
      }
    }
    if (!childTable || !parentField || !parentTable) {
      return {
        value: null,
        drillDownTable: null,
        drillDownQuery: null,
        error: 'child_table, parent_field, and parent_table are required',
      }
    }

    var grChild = new GlideRecord(childTable)
    var grParent = new GlideRecord(parentTable)
    if (!grChild.isValid()) {
      return { value: null, drillDownTable: null, drillDownQuery: null, error: 'table ' + childTable + ' not available' }
    }
    if (!grParent.isValid()) {
      return { value: null, drillDownTable: null, drillDownQuery: null, error: 'table ' + parentTable + ' not available' }
    }
    if (!grChild.isValidField(parentField)) {
      return {
        value: null,
        drillDownTable: parentTable,
        drillDownQuery: parentFilter,
        error: 'parent_field is not valid on table ' + childTable,
      }
    }

    var parents = []
    var pr = new GlideRecord(parentTable)
    if (parentFilter) pr.addEncodedQuery(parentFilter)
    pr.query()
    while (pr.next()) {
      if (parents.length >= 100000) {
        return {
          value: null,
          drillDownTable: parentTable,
          drillDownQuery: parentFilter,
          error: 'grouped average exceeded 100000 parents',
        }
      }
      parents.push(pr.getUniqueValue())
    }

    var countMap = {}
    var ga = new GlideAggregate(childTable)
    if (childFilter) ga.addEncodedQuery(childFilter)
    ga.groupBy(parentField)
    ga.addAggregate('COUNT')
    ga.query()
    while (ga.next()) {
      var pid = ga.getValue(parentField)
      if (!pid) continue
      var c = parseFloat(ga.getAggregate('COUNT'))
      if (isNaN(c)) c = 0
      countMap[pid] = c
    }

    var includeZero = p.include_zero_parents !== false
    var vals = []
    if (includeZero) {
      for (var i = 0; i < parents.length; i++) {
        var id = parents[i]
        vals.push(countMap[id] != null ? countMap[id] : 0)
      }
    } else {
      for (var k in countMap) {
        if (countMap.hasOwnProperty(k)) vals.push(countMap[k])
      }
    }

    if (vals.length === 0) {
      return {
        value: null,
        drillDownTable: parentTable,
        drillDownQuery: parentFilter,
        error: 'no values to aggregate for grouped average',
      }
    }

    var agg = String(p.aggregation || 'avg').toLowerCase()
    var value = this._aggregateArray(vals, agg)
    if (value === null || typeof value === 'undefined' || isNaN(value)) {
      return {
        value: null,
        drillDownTable: parentTable,
        drillDownQuery: parentFilter,
        error: 'aggregation produced no numeric value: ' + agg,
      }
    }
    return { value: Number(value), drillDownTable: parentTable, drillDownQuery: parentFilter, error: null }
  },

  _aggregateArray: function (vals, agg) {
    var a = []
    for (var i = 0; i < vals.length; i++) a.push(Number(vals[i]))
    if (agg === 'max') {
      var mx = a[0]
      for (var j = 1; j < a.length; j++) if (a[j] > mx) mx = a[j]
      return mx
    }
    if (agg === 'min') {
      var mn = a[0]
      for (var k = 1; k < a.length; k++) if (a[k] < mn) mn = a[k]
      return mn
    }
    a.sort(function (x, y) {
      return x - y
    })
    var n = a.length
    if (agg === 'median') return this._medianSorted(a)
    if (agg === 'p90') return this._percentileSorted(a, 90)
    if (agg === 'avg') {
      var sum = 0
      for (var m = 0; m < n; m++) sum += a[m]
      return sum / n
    }
    return null
  },

  _medianSorted: function (sorted) {
    var n = sorted.length
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

  type: 'MAFGroupedAverageCollector',
})
