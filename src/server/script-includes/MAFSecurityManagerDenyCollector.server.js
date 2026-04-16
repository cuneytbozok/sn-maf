gs.include('MAFMetricCollectorBase')

var MAFSecurityManagerDenyCollector = Class.create()
MAFSecurityManagerDenyCollector.prototype = Object.extendsObject(MAFMetricCollectorBase.prototype, {
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
    var propName = this.params.property_primary || 'glide.script.policy.security_manager.default'
    var raw = gs.getProperty(propName, '')
    var expected = (this.params.expected_deny_values || 'deny,restrictive').split(',')
    var normalized = ('' + raw).toLowerCase().trim()
    var ok = false
    for (var i = 0; i < expected.length; i++) {
      if (normalized === expected[i].trim().toLowerCase()) {
        ok = true
        break
      }
    }
    var val = ok ? 100 : 0
    return {
      value: val,
      drillDownTable: 'sys_properties',
      drillDownQuery: 'name=' + propName,
      error: null,
    }
  },

  type: 'MAFSecurityManagerDenyCollector',
})
