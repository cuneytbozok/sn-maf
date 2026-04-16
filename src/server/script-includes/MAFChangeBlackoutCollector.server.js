gs.include('MAFMetricCollectorBase')

var MAFChangeBlackoutCollector = Class.create()
MAFChangeBlackoutCollector.prototype = Object.extendsObject(MAFMetricCollectorBase.prototype, {
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
    var tables = this.params.tables || ['cmn_schedule_blackout']
    if (!Array.isArray(tables)) tables = [String(tables)]
    var total = 0
    var tableUsed = ''
    for (var i = 0; i < tables.length; i++) {
      var tn = tables[i]
      if (!tn || !gs.tableExists(tn)) continue
      var gr = new GlideRecord(tn)
      gr.addQuery('active', true)
      gr.query()
      var c = gr.getRowCount()
      if (c > 0) {
        total = c
        tableUsed = tn
        break
      }
    }
    var drillTable = tableUsed || (tables[0] && gs.tableExists(tables[0]) ? tables[0] : 'cmn_schedule_blackout')
    return {
      value: total,
      drillDownTable: drillTable,
      drillDownQuery: 'active=true',
      error: null,
    }
  },

  type: 'MAFChangeBlackoutCollector',
})
