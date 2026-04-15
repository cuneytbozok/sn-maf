gs.include('MAFMetricCollectorBase')

/**
 * OOB Choice Compliance Collector — counts non-OOB choice values on a specified
 * table+element by comparing sys_choice rows against a known set of OOB values.
 *
 * script_params:
 *   table            — target table (e.g. 'incident')
 *   element          — choice field (e.g. 'state')
 *   oob_values       — array of OOB value strings (e.g. ['1','2','3','6','7','8'])
 *   include_inactive — if true, count inactive choices too (default false)
 */
var MAFOOBChoiceComplianceCollector = Class.create()
MAFOOBChoiceComplianceCollector.prototype = Object.extendsObject(MAFMetricCollectorBase.prototype, {
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
    var p = this.params || {}
    var table = String(p.table || '').trim()
    var element = String(p.element || '').trim()
    var oobValues = p.oob_values
    var includeInactive = p.include_inactive === true || p.include_inactive === 'true'

    if (!table || !element || !oobValues || !oobValues.length) {
      return {
        value: null,
        drillDownTable: null,
        drillDownQuery: null,
        error: 'table, element, and oob_values (array) are required',
      }
    }

    var oobSet = {}
    for (var i = 0; i < oobValues.length; i++) {
      oobSet[String(oobValues[i])] = true
    }

    var gr = new GlideRecord('sys_choice')
    gr.addQuery('name', table)
    gr.addQuery('element', element)
    if (!includeInactive) {
      gr.addQuery('inactive', false)
    }
    gr.query()

    var customCount = 0
    while (gr.next()) {
      var val = gr.getValue('value')
      if (!oobSet[String(val)]) {
        customCount++
      }
    }

    var drillDown = 'name=' + table + '^element=' + element
    if (!includeInactive) {
      drillDown += '^inactive=false'
    }

    return {
      value: customCount,
      drillDownTable: 'sys_choice',
      drillDownQuery: drillDown,
      error: null,
    }
  },

  type: 'MAFOOBChoiceComplianceCollector',
})
