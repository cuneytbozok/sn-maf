gs.include('MAFMetricCollectorBase')

var MAFCmdbNoOwnerCollector = Class.create()
MAFCmdbNoOwnerCollector.prototype = Object.extendsObject(MAFMetricCollectorBase.prototype, {
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
    var gr = new GlideRecord('cmdb_ci')
    gr.query()
    var t = 0
    var no = 0
    while (gr.next()) {
      t++
      if (!gr.getValue('managed_by') && !gr.getValue('owned_by')) no++
    }
    return {
      value: t === 0 ? 0 : (no / t) * 100,
      drillDownTable: 'cmdb_ci',
      drillDownQuery: 'managed_byISEMPTY^owned_byISEMPTY',
      error: null,
    }
  },

  type: 'MAFCmdbNoOwnerCollector',
})
