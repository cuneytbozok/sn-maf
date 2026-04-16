gs.include('MAFMetricCollectorBase')

var MAFUpdateSetSizeViolationCollector = Class.create()
MAFUpdateSetSizeViolationCollector.prototype = Object.extendsObject(MAFMetricCollectorBase.prototype, {
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
    var maxRec = parseInt(this.params.max_records || '500', 10)
    if (isNaN(maxRec) || maxRec < 1) maxRec = 500
    var skipDefault = this.params.skip_default_named === true || this.params.skip_default_named === 'true'
    var violations = 0
    var us = new GlideRecord('sys_update_set')
    us.addQuery('state', 'IN', 'complete,in progress')
    if (skipDefault) {
      us.addQuery('name', 'DOES NOT CONTAIN', 'Default')
    }
    us.query()
    while (us.next()) {
      var ga = new GlideAggregate('sys_update_xml')
      ga.addQuery('update_set', us.getUniqueValue())
      ga.addAggregate('COUNT')
      ga.query()
      var cnt = 0
      if (ga.next()) cnt = parseInt(ga.getAggregate('COUNT'), 10) || 0
      if (cnt > maxRec) violations++
    }
    return {
      value: violations,
      drillDownTable: 'sys_update_set',
      drillDownQuery: 'stateINcomplete,in progress',
      error: null,
    }
  },

  type: 'MAFUpdateSetSizeViolationCollector',
})
