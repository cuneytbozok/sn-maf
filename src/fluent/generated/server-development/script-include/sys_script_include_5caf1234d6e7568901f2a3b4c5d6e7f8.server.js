var MAFCollectorFactory = Class.create()
MAFCollectorFactory.prototype = {
  /**
   * Resolves a Script Include class in the current application scope (not global).
   * @param {string} className
   * @param {GlideRecord} metricDefGR x_maf_core_metric_definition
   * @param {GlideRecord} runGR x_maf_core_assessment_run
   */
  getCollector: function (className, metricDefGR, runGR) {
    var ClassRef = this._resolveClass(className)
    if (!ClassRef) throw new Error('Collector class not found: ' + className)
    return new ClassRef(metricDefGR, runGR)
  },

  _resolveClass: function (className) {
    if (!className || !/^[A-Za-z_$][\w$]*$/.test(String(className))) return null
    try {
      if (!gs.include(className)) return null
    } catch (e1) {
      return null
    }
    var gse = new GlideScopedEvaluator()
    gse.putVariable('__maf_ctor', null)
    var wrapper = new GlideRecord('x_maf_core_collector_eval')
    wrapper.initialize()
    wrapper.setValue('script', '__maf_ctor = ' + className + ';')
    var scratchId = null
    try {
      scratchId = wrapper.insert()
      if (!scratchId) {
        gs.warn('MAFCollectorFactory: could not insert x_maf_core_collector_eval scratch row')
        return this._evalCtor(className)
      }
      wrapper.get(scratchId)
      gse.evaluateScript(wrapper, 'script')
    } catch (e2) {
      gs.debug('MAFCollectorFactory GlideScopedEvaluator failed for ' + className + ': ' + e2)
      return this._evalCtor(className)
    } finally {
      if (scratchId) {
        wrapper.get(scratchId)
        wrapper.deleteRecord()
      }
    }
    var Ctor = gse.getVariable('__maf_ctor')
    if (typeof Ctor === 'function') return Ctor
    return this._evalCtor(className)
  },

  /**
   * Fallback when scoped evaluator does not bind the constructor variable.
   * @param {string} className
   * @returns {Function|null}
   */
  _evalCtor: function (className) {
    try {
      var ctor = eval(className)
      if (typeof ctor === 'function') return ctor
    } catch (e3) {
      gs.debug('MAFCollectorFactory eval fallback failed for ' + className + ': ' + e3)
    }
    return null
  },

  type: 'MAFCollectorFactory',
}
