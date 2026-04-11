gs.include('MAFMetricCollectorBase')

/**
 * PRD §5 — schema / log introspection with a hard-coded allowlist (no dynamic SQL).
 * Keep {@link #ALLOWLIST} in sync with src/pure/mafSchemaIntrospection.js
 */
var MAFSchemaIntrospectionCollector = Class.create()
MAFSchemaIntrospectionCollector.prototype = Object.extendsObject(MAFMetricCollectorBase.prototype, {
  /** @type {string[]} */
  ALLOWLIST: [
    'sys_db_object',
    'sys_dictionary',
    'sys_script',
    'sys_script_client',
    'sys_ui_policy',
    'sys_trigger',
    'sys_update_set',
    'sys_update_xml',
    'sys_user',
    'sys_user_has_role',
    'sys_security_acl',
    'sys_security_acl_role',
    'sys_rest_message',
    'sys_rest_message_fn',
    'sys_email',
    'sysevent',
    'sysevent_register',
    'sys_app',
    'v_plugin',
    'syslog',
    'sys_transaction_pattern',
    'sys_audit',
    'sys_archive',
  ],

  LOG_TABLES: ['syslog', 'sys_audit', 'sys_transaction_pattern'],

  WINDOW_DEFAULT_HOURS: 24,
  WINDOW_MAX_HOURS: 168,

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
    var mode = String(p.mode || '').trim()
    if (!mode) {
      return { value: null, drillDownTable: null, drillDownQuery: null, error: 'mode is required in script_params' }
    }

    if (mode === 'count') return this._modeCount(p)
    if (mode === 'group_collision') return this._modeGroupCollision(p)
    if (mode === 'row_count_over_threshold') return this._modeRowCountOverThreshold(p)
    if (mode === 'windowed_count') return this._modeWindowedCount(p)
    if (mode === 'windowed_distinct') return this._modeWindowedDistinct(p)
    if (mode === 'acl_effectively_open') return this._modeAclEffectivelyOpen(p)

    return { value: null, drillDownTable: null, drillDownQuery: null, error: 'unknown mode: ' + mode }
  },

  _isAllowlisted: function (table) {
    var t = String(table || '').trim()
    for (var i = 0; i < this.ALLOWLIST.length; i++) {
      if (this.ALLOWLIST[i] === t) return true
    }
    return false
  },

  _isLogTable: function (table) {
    var t = String(table || '').trim()
    for (var j = 0; j < this.LOG_TABLES.length; j++) {
      if (this.LOG_TABLES[j] === t) return true
    }
    return false
  },

  _normalizeWindowHours: function (raw) {
    if (raw === null || typeof raw === 'undefined' || raw === '') return { hours: this.WINDOW_DEFAULT_HOURS }
    var h = parseInt(raw, 10)
    if (isNaN(h) || h < 1) return { hours: this.WINDOW_DEFAULT_HOURS, error: 'window_hours must be between 1 and ' + this.WINDOW_MAX_HOURS }
    if (h > this.WINDOW_MAX_HOURS) return { hours: this.WINDOW_DEFAULT_HOURS, error: 'window_hours exceeds maximum (' + this.WINDOW_MAX_HOURS + 'h)' }
    return { hours: h }
  },

  _appendTimeWindow: function (filter, windowField, hours) {
    var wf = windowField && String(windowField).trim() ? String(windowField).trim() : 'sys_created_on'
    var clause = wf + '>=javascript:gs.hoursAgoStart(' + hours + ')'
    var f = filter != null ? String(filter) : ''
    if (!f || f.trim() === '') return clause
    return f + '^' + clause
  },

  _aggregateCount: function (table, encodedQuery) {
    var ga = new GlideAggregate(String(table))
    if (encodedQuery) ga.addEncodedQuery(String(encodedQuery))
    ga.addAggregate('COUNT', null)
    ga.query()
    if (!ga.next()) return 0
    var v = ga.getAggregate('COUNT', null)
    return parseInt(v, 10) || 0
  },

  _modeCount: function (p) {
    var table = String(p.table || '').trim()
    if (!this._isAllowlisted(table)) {
      return { value: null, drillDownTable: null, drillDownQuery: null, error: 'table not allowlisted: ' + table }
    }
    var gr = new GlideRecord(table)
    if (!gr.isValid()) {
      return { value: null, drillDownTable: table, drillDownQuery: String(p.filter || ''), error: 'table not available: ' + table }
    }
    var filter = String(p.filter || '')
    if (this._isLogTable(table)) {
      var wh = this._normalizeWindowHours(p.window_hours)
      if (wh.error) return { value: null, drillDownTable: table, drillDownQuery: filter, error: wh.error }
      var wf = p.window_field != null && String(p.window_field).trim() ? String(p.window_field).trim() : 'sys_created_on'
      filter = this._appendTimeWindow(filter, wf, wh.hours)
    }
    var n = this._aggregateCount(table, filter)
    return { value: Number(n), drillDownTable: table, drillDownQuery: filter, error: null }
  },

  _modeGroupCollision: function (p) {
    var table = String(p.table || '').trim()
    if (!this._isAllowlisted(table)) {
      return { value: null, drillDownTable: null, drillDownQuery: null, error: 'table not allowlisted: ' + table }
    }
    var gr = new GlideRecord(table)
    if (!gr.isValid()) {
      return { value: null, drillDownTable: table, drillDownQuery: String(p.filter || ''), error: 'table not available: ' + table }
    }
    var groupBy = String(p.group_by || '').trim()
    if (!groupBy) {
      return { value: null, drillDownTable: table, drillDownQuery: String(p.filter || ''), error: 'group_by is required' }
    }
    var parts = groupBy.split(',')
    var fields = []
    for (var i = 0; i < parts.length; i++) {
      var f = String(parts[i]).trim()
      if (f) fields.push(f)
    }
    if (fields.length === 0) {
      return { value: null, drillDownTable: table, drillDownQuery: String(p.filter || ''), error: 'group_by is required' }
    }
    var minGroup = p.min_group_size != null && String(p.min_group_size) !== '' ? parseInt(p.min_group_size, 10) : 2
    if (isNaN(minGroup) || minGroup < 1) minGroup = 2

    var filter = String(p.filter || '')
    if (this._isLogTable(table)) {
      var wh2 = this._normalizeWindowHours(p.window_hours)
      if (wh2.error) return { value: null, drillDownTable: table, drillDownQuery: filter, error: wh2.error }
      var wf2 = p.window_field != null && String(p.window_field).trim() ? String(p.window_field).trim() : 'sys_created_on'
      filter = this._appendTimeWindow(filter, wf2, wh2.hours)
    }

    var ga = new GlideAggregate(String(table))
    if (filter) ga.addEncodedQuery(filter)
    for (var g = 0; g < fields.length; g++) ga.groupBy(fields[g])
    ga.addAggregate('COUNT', null)
    ga.query()
    var collisionGroups = 0
    while (ga.next()) {
      var cntStr = ga.getAggregate('COUNT', null)
      var cnt = parseInt(cntStr, 10) || 0
      if (cnt >= minGroup) collisionGroups++
    }
    return { value: Number(collisionGroups), drillDownTable: table, drillDownQuery: filter, error: null }
  },

  _modeRowCountOverThreshold: function (p) {
    var metadataTable = String(p.metadata_table || '').trim()
    if (!this._isAllowlisted(metadataTable)) {
      return { value: null, drillDownTable: null, drillDownQuery: null, error: 'metadata_table not allowlisted: ' + metadataTable }
    }
    var metaGrCheck = new GlideRecord(metadataTable)
    if (!metaGrCheck.isValid()) {
      return { value: null, drillDownTable: metadataTable, drillDownQuery: String(p.metadata_filter || ''), error: 'metadata_table not available' }
    }
    var nameField = String(p.metadata_name_field || '').trim()
    if (!nameField) {
      return { value: null, drillDownTable: metadataTable, drillDownQuery: String(p.metadata_filter || ''), error: 'metadata_name_field is required' }
    }
    var rowThreshold = parseFloat(p.row_threshold)
    if (isNaN(rowThreshold) || rowThreshold < 0) {
      return { value: null, drillDownTable: metadataTable, drillDownQuery: String(p.metadata_filter || ''), error: 'row_threshold must be a non-negative number' }
    }
    var maxScan = parseInt(p.max_tables_scanned, 10)
    if (isNaN(maxScan) || maxScan < 1) {
      return { value: null, drillDownTable: metadataTable, drillDownQuery: String(p.metadata_filter || ''), error: 'max_tables_scanned must be >= 1' }
    }

    var metaFilter = String(p.metadata_filter || '')
    var totalMeta = this._aggregateCount(metadataTable, metaFilter)
    if (totalMeta > maxScan) {
      return {
        value: null,
        drillDownTable: metadataTable,
        drillDownQuery: metaFilter,
        error: 'metadata rows (' + totalMeta + ') exceed max_tables_scanned (' + maxScan + ')',
      }
    }

    var metaWalk = new GlideRecord(metadataTable)
    if (metaFilter) metaWalk.addEncodedQuery(metaFilter)
    metaWalk.query()
    var overCount = 0
    var requireNoArchive = p.require_no_active_archive === true || p.require_no_active_archive === 'true'
    while (metaWalk.next()) {
      var tname = metaWalk.getValue(nameField)
      var tgt = String(tname || '').trim()
      if (!tgt) continue
      var tgr = new GlideRecord(tgt)
      if (!tgr.isValid()) continue
      var cnt = this._aggregateCount(tgt, '')
      if (cnt <= rowThreshold) continue
      if (requireNoArchive && this._tableHasActiveArchiveRule(tgt, p)) continue
      overCount++
    }
    return { value: Number(overCount), drillDownTable: metadataTable, drillDownQuery: metaFilter, error: null }
  },

  /**
   * P-DATA-05 — active archive rule on {@code sys_archive} (or {@code archive_rule_table}) for physical table name.
   */
  _tableHasActiveArchiveRule: function (physicalTableName, p) {
    var ruleTable = String((p && p.archive_rule_table) || 'sys_archive').trim()
    if (ruleTable !== 'sys_archive') {
      return false
    }
    var ar = new GlideRecord('sys_archive')
    if (!ar.isValid()) return false
    ar.addQuery('active', true)
    var matchField = String((p && p.archive_match_field) || 'collection').trim()
    if (matchField) {
      ar.addQuery(matchField, physicalTableName)
    } else {
      ar.addQuery('collection', physicalTableName)
    }
    ar.query()
    return ar.hasNext()
  },

  _modeWindowedCount: function (p) {
    var table = String(p.table || '').trim()
    if (!this._isLogTable(table)) {
      return {
        value: null,
        drillDownTable: null,
        drillDownQuery: null,
        error: 'windowed_count is only valid for syslog, sys_audit, or sys_transaction_pattern',
      }
    }
    if (!this._isAllowlisted(table)) {
      return { value: null, drillDownTable: null, drillDownQuery: null, error: 'table not allowlisted: ' + table }
    }
    var gr = new GlideRecord(table)
    if (!gr.isValid()) {
      return { value: null, drillDownTable: table, drillDownQuery: String(p.filter || ''), error: 'table not available: ' + table }
    }
    var wh = this._normalizeWindowHours(p.window_hours)
    if (wh.error) return { value: null, drillDownTable: table, drillDownQuery: String(p.filter || ''), error: wh.error }
    var wf = p.window_field != null && String(p.window_field).trim() ? String(p.window_field).trim() : 'sys_created_on'
    var filter = String(p.filter || '')
    var combined = this._appendTimeWindow(filter, wf, wh.hours)
    var n = this._aggregateCount(table, combined)
    return { value: Number(n), drillDownTable: table, drillDownQuery: combined, error: null }
  },

  /**
   * P-LOG-01 — distinct values of {@code distinct_field} in a log table within the mandatory window.
   */
  _modeWindowedDistinct: function (p) {
    var table = String(p.table || '').trim()
    if (!this._isLogTable(table)) {
      return {
        value: null,
        drillDownTable: null,
        drillDownQuery: null,
        error: 'windowed_distinct is only valid for syslog, sys_audit, or sys_transaction_pattern',
      }
    }
    if (!this._isAllowlisted(table)) {
      return { value: null, drillDownTable: null, drillDownQuery: null, error: 'table not allowlisted: ' + table }
    }
    var gr = new GlideRecord(table)
    if (!gr.isValid()) {
      return { value: null, drillDownTable: table, drillDownQuery: String(p.filter || ''), error: 'table not available: ' + table }
    }
    var wh = this._normalizeWindowHours(p.window_hours)
    if (wh.error) return { value: null, drillDownTable: table, drillDownQuery: String(p.filter || ''), error: wh.error }
    var wf = p.window_field != null && String(p.window_field).trim() ? String(p.window_field).trim() : 'sys_created_on'
    var distinctField = String(p.distinct_field || 'message').trim()
    if (!distinctField) {
      return { value: null, drillDownTable: table, drillDownQuery: String(p.filter || ''), error: 'distinct_field is required' }
    }
    var filter = String(p.filter || '')
    var combined = this._appendTimeWindow(filter, wf, wh.hours)
    var ga = new GlideAggregate(String(table))
    if (combined) ga.addEncodedQuery(combined)
    ga.groupBy(distinctField)
    ga.addAggregate('COUNT', null)
    ga.query()
    var distinctCount = 0
    while (ga.next()) distinctCount++
    return { value: Number(distinctCount), drillDownTable: table, drillDownQuery: combined, error: null }
  },

  /**
   * P-SEC-04 — ACL rows with no script, no condition, and no {@code sys_security_acl_role} rows (effectively open).
   */
  _modeAclEffectivelyOpen: function (p) {
    var table = String(p.table || '').trim()
    if (table !== 'sys_security_acl') {
      return {
        value: null,
        drillDownTable: null,
        drillDownQuery: null,
        error: 'acl_effectively_open requires table=sys_security_acl',
      }
    }
    if (!this._isAllowlisted(table)) {
      return { value: null, drillDownTable: null, drillDownQuery: null, error: 'table not allowlisted: ' + table }
    }
    var aclGr = new GlideRecord('sys_security_acl')
    if (!aclGr.isValid()) {
      return { value: null, drillDownTable: table, drillDownQuery: String(p.filter || ''), error: 'table not available' }
    }
    var roleProbe = new GlideRecord('sys_security_acl_role')
    if (!roleProbe.isValid()) {
      return { value: null, drillDownTable: table, drillDownQuery: String(p.filter || ''), error: 'sys_security_acl_role not available' }
    }
    var withRoles = {}
    var ga = new GlideAggregate('sys_security_acl_role')
    ga.groupBy('sys_security_acl')
    ga.addAggregate('COUNT', null)
    ga.query()
    while (ga.next()) {
      var aid = ga.getValue('sys_security_acl')
      if (aid) withRoles[aid] = true
    }
    var filter = String(p.filter || '')
    var gr = new GlideRecord('sys_security_acl')
    if (filter) gr.addEncodedQuery(filter)
    gr.query()
    var n = 0
    while (gr.next()) {
      var sid = gr.getUniqueValue()
      if (withRoles[sid]) continue
      n++
    }
    return { value: Number(n), drillDownTable: table, drillDownQuery: filter, error: null }
  },

  type: 'MAFSchemaIntrospectionCollector',
})
