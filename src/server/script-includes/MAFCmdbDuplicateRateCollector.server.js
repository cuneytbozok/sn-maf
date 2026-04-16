gs.include('MAFMetricCollectorBase')

var MAFCmdbDuplicateRateCollector = Class.create()
MAFCmdbDuplicateRateCollector.prototype = Object.extendsObject(MAFMetricCollectorBase.prototype, {
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
    var groups = {}
    var gr = new GlideRecord('cmdb_ci')
    gr.query()
    while (gr.next()) {
      var sn = gr.getValue('serial_number') || ''
      if (!sn) continue
      var k = gr.getValue('name') + '|' + gr.getValue('sys_class_name') + '|' + sn
      groups[k] = (groups[k] || 0) + 1
    }
    var dup = 0
    var total = 0
    gr = new GlideRecord('cmdb_ci')
    gr.addQuery('serial_number', '!=', '')
    gr.query()
    while (gr.next()) {
      total++
      var key =
        gr.getValue('name') + '|' + gr.getValue('sys_class_name') + '|' + gr.getValue('serial_number')
      if (groups[key] > 1) dup++
    }
    var pct = total === 0 ? 0 : (dup / total) * 100
    return {
      value: pct,
      drillDownTable: 'cmdb_ci',
      drillDownQuery: 'serial_numberISNOTEMPTY',
      error: null,
    }
  },

  type: 'MAFCmdbDuplicateRateCollector',
})
