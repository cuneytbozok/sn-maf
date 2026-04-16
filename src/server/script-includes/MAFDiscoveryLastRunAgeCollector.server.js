gs.include('MAFMetricCollectorBase')

var MAFDiscoveryLastRunAgeCollector = Class.create()
MAFDiscoveryLastRunAgeCollector.prototype = Object.extendsObject(MAFMetricCollectorBase.prototype, {
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
    var table = this.params.table || 'discovery_status'
    var dateField = this.params.date_field || 'sys_updated_on'
    if (!gs.tableExists(table)) {
      return {
        value: null,
        drillDownTable: null,
        drillDownQuery: null,
        error: 'Table not found: ' + table,
      }
    }
    var gr = new GlideRecord(table)
    gr.orderByDesc(dateField)
    gr.query()
    if (!gr.next()) {
      return { value: 999, drillDownTable: table, drillDownQuery: 'sys_idISNOTEMPTY', error: null }
    }
    var lastStr = gr.getValue(dateField)
    var days = parseInt(gs.dateDiff(lastStr, gs.now(), true), 10)
    if (isNaN(days) || days < 0) days = 0
    return {
      value: days,
      drillDownTable: table,
      drillDownQuery: 'sys_id=' + gr.getUniqueValue(),
      error: null,
    }
  },

  type: 'MAFDiscoveryLastRunAgeCollector',
})
