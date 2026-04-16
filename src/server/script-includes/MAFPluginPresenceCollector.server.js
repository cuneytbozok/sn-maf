gs.include('MAFMetricCollectorBase')

var MAFPluginPresenceCollector = Class.create()
MAFPluginPresenceCollector.prototype = Object.extendsObject(MAFMetricCollectorBase.prototype, {
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
    var pid = this.params.plugin_id || 'com.glide.hsp'
    var gr = new GlideRecord('v_plugin')
    gr.addQuery('id', pid)
    gr.addQuery('active', true)
    gr.query()
    var val = gr.hasNext() ? 100 : 0
    return {
      value: val,
      drillDownTable: 'v_plugin',
      drillDownQuery: 'id=' + pid,
      error: null,
    }
  },

  type: 'MAFPluginPresenceCollector',
})
