gs.include('MAFMetricCollectorBase')

var MAFCsdmAppToBizLinkCollector = Class.create()
MAFCsdmAppToBizLinkCollector.prototype = Object.extendsObject(MAFMetricCollectorBase.prototype, {
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
    var appClass = this.params.app_class || 'cmdb_ci_appl'
    var apps = new GlideRecord('cmdb_ci')
    apps.addQuery('sys_class_name', appClass)
    apps.query()
    var total = apps.getRowCount()
    if (total === 0) {
      return {
        value: 100,
        drillDownTable: 'cmdb_ci',
        drillDownQuery: 'sys_class_name=' + appClass,
        error: null,
      }
    }
    var linked = 0
    apps = new GlideRecord('cmdb_ci')
    apps.addQuery('sys_class_name', appClass)
    apps.query()
    while (apps.next()) {
      var rel = new GlideRecord('cmdb_rel_ci')
      rel.addQuery('child', apps.getUniqueValue())
      rel.query()
      if (rel.hasNext()) linked++
    }
    return {
      value: (linked / total) * 100,
      drillDownTable: 'cmdb_ci',
      drillDownQuery: 'sys_class_name=' + appClass,
      error: null,
    }
  },

  type: 'MAFCsdmAppToBizLinkCollector',
})
