var MAFMetricCollectorBase = Class.create()
MAFMetricCollectorBase.prototype = {
  initialize: function (metricDefGR, assessmentRunGR) {
    this.metricDef = metricDefGR
    this.run = assessmentRunGR
    this.params = {}
    var raw = metricDefGR.getValue('script_params')
    if (raw) {
      try {
        this.params = JSON.parse(raw)
      } catch (e) {
        this.params = {}
      }
    }
  },
  collect: function () {
    throw new Error('collect() must be implemented by subclass')
  },
  type: 'MAFMetricCollectorBase',
}
