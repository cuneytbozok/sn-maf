gs.include('MAFMetricCollectorBase')

var MAFCmdbAvgRelPerCiCollector = Class.create()
MAFCmdbAvgRelPerCiCollector.prototype = Object.extendsObject(MAFMetricCollectorBase.prototype, {
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
    var rel = new GlideRecord('cmdb_rel_ci')
    rel.query()
    var edges = rel.getRowCount()
    var ga = new GlideAggregate('cmdb_ci')
    ga.addAggregate('COUNT')
    ga.query()
    ga.next()
    var c = parseInt(ga.getAggregate('COUNT'), 10) || 1
    return {
      value: edges / c,
      drillDownTable: 'cmdb_rel_ci',
      drillDownQuery: 'sys_idISNOTEMPTY',
      error: null,
    }
  },

  type: 'MAFCmdbAvgRelPerCiCollector',
})
