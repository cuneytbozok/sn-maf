gs.include('MAFMetricCollectorBase')

var MAFCiServiceMappingRateCollector = Class.create()
MAFCiServiceMappingRateCollector.prototype = Object.extendsObject(MAFMetricCollectorBase.prototype, {
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
    var mapped = {}
    if (gs.tableExists('svc_ci_assoc')) {
      var assoc = new GlideRecord('svc_ci_assoc')
      if (assoc.isValid()) {
        var ciEl = assoc.isValidField('ci_id') ? 'ci_id' : 'configuration_item'
        assoc.query()
        while (assoc.next()) {
          mapped[assoc.getValue(ciEl)] = true
        }
      }
    }
    var rel = new GlideRecord('cmdb_rel_ci')
    rel.addQuery('type', 'CONTAINS', 'Depends on')
    rel.query()
    while (rel.next()) {
      mapped[rel.getValue('parent')] = true
      mapped[rel.getValue('child')] = true
    }
    var gr = new GlideRecord('cmdb_ci')
    gr.query()
    var t = 0
    var m = 0
    while (gr.next()) {
      t++
      if (mapped[gr.getUniqueValue()]) m++
    }
    var pct = t === 0 ? 0 : (m / t) * 100
    return {
      value: pct,
      drillDownTable: 'cmdb_ci',
      drillDownQuery: 'sys_idISNOTEMPTY',
      error: null,
    }
  },

  type: 'MAFCiServiceMappingRateCollector',
})
