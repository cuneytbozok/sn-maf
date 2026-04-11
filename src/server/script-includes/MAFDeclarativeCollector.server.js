gs.include('MAFMetricCollectorBase')

var MAFDeclarativeCollector = Class.create()
MAFDeclarativeCollector.prototype = Object.extendsObject(MAFMetricCollectorBase.prototype, {
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
    var md = this.metricDef
    var table = md.getValue('source_table')
    if (!table) return { value: null, drillDownTable: null, drillDownQuery: null, error: 'source_table is required' }

    var grTable = new GlideRecord(table)
    if (!grTable.isValid()) {
      return { value: null, drillDownTable: null, drillDownQuery: null, error: 'table ' + table + ' not available' }
    }

    var agg = md.getValue('aggregation')
    var filterQ = md.getValue('filter_condition') || ''
    var aggField = md.getValue('aggregation_field')

    var drillTable = table
    var drillQuery = filterQ

    var value
    if (agg === 'percentage') {
      value = this._percentage(table, filterQ, md.getValue('denominator_filter'))
    } else if (agg === 'count') {
      value = this._simpleAggregate(table, filterQ, 'COUNT', null)
    } else if (agg === 'count_distinct') {
      if (!aggField) return { value: null, drillDownTable: drillTable, drillDownQuery: drillQuery, error: 'aggregation_field is required for count_distinct' }
      value = this._countDistinct(table, filterQ, aggField)
    } else if (agg === 'sum') {
      if (!aggField) return { value: null, drillDownTable: drillTable, drillDownQuery: drillQuery, error: 'aggregation_field is required for sum' }
      value = this._simpleAggregate(table, filterQ, 'SUM', aggField)
    } else if (agg === 'avg') {
      if (!aggField) return { value: null, drillDownTable: drillTable, drillDownQuery: drillQuery, error: 'aggregation_field is required for avg' }
      value = this._simpleAggregate(table, filterQ, 'AVG', aggField)
    } else {
      return { value: null, drillDownTable: drillTable, drillDownQuery: drillQuery, error: 'Unknown aggregation: ' + agg }
    }

    if (value === null || typeof value === 'undefined' || isNaN(value)) {
      return { value: null, drillDownTable: drillTable, drillDownQuery: drillQuery, error: 'Aggregation produced no numeric value' }
    }

    return { value: Number(value), drillDownTable: drillTable, drillDownQuery: drillQuery, error: null }
  },

  _simpleAggregate: function (table, encodedQuery, aggType, fieldName) {
    var ga = new GlideAggregate(table)
    if (encodedQuery) ga.addEncodedQuery(encodedQuery)
    var agg = String(aggType).toUpperCase()
    if (agg === 'COUNT') {
      ga.addAggregate('COUNT', null)
    } else {
      ga.addAggregate(agg, fieldName)
    }
    ga.query()
    if (!ga.next()) return 0
    var v = ga.getAggregate(agg, agg === 'COUNT' ? null : fieldName)
    return parseFloat(v)
  },

  _countDistinct: function (table, encodedQuery, fieldName) {
    var ga = new GlideAggregate(table)
    if (encodedQuery) ga.addEncodedQuery(encodedQuery)
    ga.groupBy(fieldName)
    ga.addAggregate('COUNT', null)
    ga.query()
    var n = 0
    while (ga.next()) n++
    return n
  },

  _percentage: function (table, numQuery, denQuery) {
    var num = this._simpleAggregate(table, numQuery || '', 'COUNT', null)
    var denQ = denQuery != null && String(denQuery).length > 0 ? denQuery : ''
    var den = this._simpleAggregate(table, denQ, 'COUNT', null)
    if (!den || den === 0) return 0
    return (num / den) * 100
  },

  type: 'MAFDeclarativeCollector',
})
