gs.include('MAFMetricCollectorBase')

var MAFCmdbRelTypeDistinctCollector = Class.create()
MAFCmdbRelTypeDistinctCollector.prototype = Object.extendsObject(MAFMetricCollectorBase.prototype, {
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
    var types = {}
    var gr = new GlideRecord('cmdb_rel_ci')
    gr.query()
    while (gr.next()) {
      types[gr.getValue('type')] = true
    }
    var n = 0
    for (var k in types) {
      if (types.hasOwnProperty(k)) n++
    }
    return {
      value: n,
      drillDownTable: 'cmdb_rel_ci',
      drillDownQuery: 'sys_idISNOTEMPTY',
      error: null,
    }
  },

  type: 'MAFCmdbRelTypeDistinctCollector',
})
