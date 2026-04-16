gs.include('MAFMetricCollectorBase')

/**
 * Checks what percentage of records in a service-related table have all specified
 * governance fields (support_group, change_group, managed_by, owned_by) populated.
 *
 * Params (via script_params JSON):
 *   table   {string} - ServiceNow table name (e.g. 'cmdb_ci_service', 'service_offering')
 *   filter  {string} - Optional encoded query to scope records (e.g. 'sys_class_name=cmdb_ci_service')
 *   fields  {string[]} - Governance field names to check (only fields valid on the table are evaluated)
 *
 * Returns:
 *   value          - % of records where ALL valid governance fields are populated (0–100)
 *   drillDownTable - the target table
 *   drillDownQuery - encoded query selecting records where ANY governance field is empty
 */
var MAFServiceGovernanceFieldsCollector = Class.create()
MAFServiceGovernanceFieldsCollector.prototype = Object.extendsObject(MAFMetricCollectorBase.prototype, {
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
    var table = this.params.table
    var filter = this.params.filter || ''
    var fields = this.params.fields || []

    if (!table) {
      return { value: null, drillDownTable: null, drillDownQuery: null, error: 'Missing required param: table' }
    }
    if (!fields.length) {
      return { value: null, drillDownTable: table, drillDownQuery: '', error: 'Missing required param: fields' }
    }

    // Validate table exists
    var probe = new GlideRecord(table)
    if (!probe.isValid()) {
      return { value: null, drillDownTable: table, drillDownQuery: '', error: 'Table not found: ' + table }
    }

    // Determine which fields actually exist on this table (skip unknowns gracefully)
    var validFields = []
    for (var fi = 0; fi < fields.length; fi++) {
      if (probe.isValidField(fields[fi])) {
        validFields.push(fields[fi])
      }
    }

    if (!validFields.length) {
      return {
        value: null,
        drillDownTable: table,
        drillDownQuery: '',
        error: 'None of the specified fields exist on table: ' + table,
      }
    }

    // Query records and count how many have ALL governance fields populated
    var gr = new GlideRecord(table)
    if (filter) {
      gr.addEncodedQuery(filter)
    }
    gr.query()

    var total = 0
    var passing = 0
    while (gr.next()) {
      total++
      var allPopulated = true
      for (var vi = 0; vi < validFields.length; vi++) {
        var val = gr.getValue(validFields[vi])
        if (!val || val === '') {
          allPopulated = false
          break
        }
      }
      if (allPopulated) {
        passing++
      }
    }

    // Build drill-down query: records where ANY governance field is empty
    var emptyConditions = []
    for (var ei = 0; ei < validFields.length; ei++) {
      emptyConditions.push(validFields[ei] + 'ISEMPTY')
    }
    var drillDownQuery = (filter ? filter + '^' : '') + emptyConditions.join('^OR')

    return {
      value: total === 0 ? 0 : (passing / total) * 100,
      drillDownTable: table,
      drillDownQuery: drillDownQuery,
      error: null,
    }
  },

  type: 'MAFServiceGovernanceFieldsCollector',
})
