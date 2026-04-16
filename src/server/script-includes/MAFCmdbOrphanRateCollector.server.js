gs.include('MAFMetricCollectorBase')

var MAFCmdbOrphanRateCollector = Class.create()
MAFCmdbOrphanRateCollector.prototype = Object.extendsObject(MAFMetricCollectorBase.prototype, {
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
    var withRel = {}
    while (rel.next()) {
      withRel[rel.getValue('parent')] = true
      withRel[rel.getValue('child')] = true
    }
    var total = new GlideAggregate('cmdb_ci')
    total.addAggregate('COUNT')
    total.query()
    total.next()
    var t = parseInt(total.getAggregate('COUNT'), 10) || 0
    if (t === 0) {
      return { value: 0, drillDownTable: 'cmdb_ci', drillDownQuery: 'sys_idISEMPTY', error: null }
    }
    var gr = new GlideRecord('cmdb_ci')
    gr.query()
    var orphans = 0
    while (gr.next()) {
      var id = gr.getUniqueValue()
      if (!withRel[id]) orphans++
    }
    var pct = (orphans / t) * 100
    return {
      value: pct,
      drillDownTable: 'cmdb_ci',
      drillDownQuery: 'sys_idISNOTEMPTY',
      error: null,
    }
  },

  type: 'MAFCmdbOrphanRateCollector',
})
