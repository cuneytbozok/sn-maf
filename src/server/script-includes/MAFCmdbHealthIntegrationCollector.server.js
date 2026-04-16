gs.include('MAFMetricCollectorBase')

var MAFCmdbHealthIntegrationCollector = Class.create()
MAFCmdbHealthIntegrationCollector.prototype = Object.extendsObject(MAFMetricCollectorBase.prototype, {
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
    var ids = this.params.plugin_ids || []
    if (!Array.isArray(ids)) ids = []
    var ok = false
    for (var i = 0; i < ids.length; i++) {
      var gr = new GlideRecord('v_plugin')
      gr.addQuery('id', ids[i])
      gr.addQuery('active', true)
      gr.query()
      if (gr.next()) {
        ok = true
        break
      }
    }
    var prop = this.params.optional_property
    if (prop && gs.getProperty(prop, 'false') === 'true') ok = true
    return {
      value: ok ? 100 : 0,
      drillDownTable: 'v_plugin',
      drillDownQuery: 'sys_idISNOTEMPTY',
      error: null,
    }
  },

  type: 'MAFCmdbHealthIntegrationCollector',
})
