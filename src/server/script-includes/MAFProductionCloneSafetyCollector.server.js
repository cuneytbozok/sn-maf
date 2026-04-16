gs.include('MAFMetricCollectorBase')

var MAFProductionCloneSafetyCollector = Class.create()
MAFProductionCloneSafetyCollector.prototype = Object.extendsObject(MAFMetricCollectorBase.prototype, {
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
    var cloneTargetProp = this.params.clone_target_property || 'glide.db.clone.target'
    var val = gs.getProperty(cloneTargetProp, '')
    var isProd =
      gs.getProperty('instance.installation.production', 'true') === 'true' ||
      gs.getProperty('glide.installation.production', 'true') === 'true'
    var unsafe = isProd && val && String(val).length > 0
    var score = unsafe ? 0 : 100
    return {
      value: score,
      drillDownTable: 'sys_properties',
      drillDownQuery: 'name=' + cloneTargetProp,
      error: null,
    }
  },

  type: 'MAFProductionCloneSafetyCollector',
})
