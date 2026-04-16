gs.include('MAFMetricCollectorBase')

var MAFServiceMappingActiveCollector = Class.create()
MAFServiceMappingActiveCollector.prototype = Object.extendsObject(MAFMetricCollectorBase.prototype, {
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
    var pid = this.params.plugin_id
    if (pid) {
      var pl = new GlideRecord('v_plugin')
      pl.addQuery('id', pid)
      pl.addQuery('active', true)
      pl.query()
      if (!pl.next()) {
        return { value: 0, drillDownTable: 'v_plugin', drillDownQuery: 'id=' + pid, error: null }
      }
    }
    var tables = this.params.tables || ['sm_m2m_pattern_ci']
    if (!Array.isArray(tables)) tables = [String(tables)]
    var total = 0
    var firstTable = ''
    for (var i = 0; i < tables.length; i++) {
      if (!gs.tableExists(tables[i])) continue
      if (!firstTable) firstTable = tables[i]
      var gr = new GlideRecord(tables[i])
      gr.query()
      total += gr.getRowCount()
    }
    if (!firstTable) firstTable = 'sm_m2m_pattern_ci'
    return {
      value: total,
      drillDownTable: firstTable,
      drillDownQuery: 'sys_idISNOTEMPTY',
      error: null,
    }
  },

  type: 'MAFServiceMappingActiveCollector',
})
