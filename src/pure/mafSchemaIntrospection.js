/**
 * PRD §5 — MAFSchemaIntrospectionCollector: allowlist + param validation (Node unit tests).
 * Keep allowlist in sync with MAFSchemaIntrospectionCollector.server.js
 */

/** @type {readonly string[]} */
export const MAF_SCHEMA_INTROSPECTION_ALLOWLIST = Object.freeze([
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
])

export const MAF_SCHEMA_INTROSPECTION_LOG_TABLES = Object.freeze(['syslog', 'sys_audit', 'sys_transaction_pattern'])

const WINDOW_DEFAULT_HOURS = 24
const WINDOW_MAX_HOURS = 168

/**
 * @param {string} table
 * @returns {boolean}
 */
export function mafSchemaIntrospectionIsAllowlisted(table) {
  const t = String(table || '').trim()
  return MAF_SCHEMA_INTROSPECTION_ALLOWLIST.indexOf(t) >= 0
}

/**
 * @param {string} table
 * @returns {boolean}
 */
export function mafSchemaIntrospectionIsLogTable(table) {
  const t = String(table || '').trim()
  return MAF_SCHEMA_INTROSPECTION_LOG_TABLES.indexOf(t) >= 0
}

/**
 * @param {Record<string, unknown>} params
 * @returns {{ ok: true, mode: string, error?: undefined } | { ok: false, error: string }}
 */
export function validateSchemaIntrospectionParams(params) {
  if (!params || typeof params !== 'object') return { ok: false, error: 'script_params must be a JSON object' }
  const mode = String(params.mode || '').trim()
  if (!mode) return { ok: false, error: 'mode is required' }

  if (mode === 'count') {
    const table = String(params.table || '').trim()
    if (!mafSchemaIntrospectionIsAllowlisted(table)) return { ok: false, error: 'table not allowlisted: ' + table }
    if (mafSchemaIntrospectionIsLogTable(table)) {
      const wh = normalizeWindowHours(params.window_hours)
      if (wh.error) return { ok: false, error: wh.error }
    }
    return { ok: true, mode }
  }

  if (mode === 'group_collision') {
    const table = String(params.table || '').trim()
    if (!mafSchemaIntrospectionIsAllowlisted(table)) return { ok: false, error: 'table not allowlisted: ' + table }
    const gb = String(params.group_by || '').trim()
    if (!gb) return { ok: false, error: 'group_by is required' }
    if (mafSchemaIntrospectionIsLogTable(table)) {
      const wh = normalizeWindowHours(params.window_hours)
      if (wh.error) return { ok: false, error: wh.error }
    }
    return { ok: true, mode }
  }

  if (mode === 'row_count_over_threshold') {
    const mt = String(params.metadata_table || '').trim()
    if (!mafSchemaIntrospectionIsAllowlisted(mt)) return { ok: false, error: 'metadata_table not allowlisted: ' + mt }
    const mnf = String(params.metadata_name_field || '').trim()
    if (!mnf) return { ok: false, error: 'metadata_name_field is required' }
    const rt = Number(params.row_threshold)
    if (Number.isNaN(rt) || rt < 0) return { ok: false, error: 'row_threshold must be a non-negative number' }
    const caps = Number(params.max_tables_scanned)
    if (!Number.isFinite(caps) || caps < 1) return { ok: false, error: 'max_tables_scanned must be >= 1' }
    if (params.require_no_active_archive === true || params.require_no_active_archive === 'true') {
      const art = String(params.archive_rule_table || 'sys_archive').trim()
      if (art !== 'sys_archive') return { ok: false, error: 'archive_rule_table must be sys_archive when require_no_active_archive is set' }
    }
    return { ok: true, mode }
  }

  if (mode === 'windowed_count') {
    const table = String(params.table || '').trim()
    if (!mafSchemaIntrospectionIsLogTable(table)) {
      return { ok: false, error: 'windowed_count is only valid for syslog, sys_audit, or sys_transaction_pattern' }
    }
    const wh = normalizeWindowHours(params.window_hours)
    if (wh.error) return { ok: false, error: wh.error }
    return { ok: true, mode }
  }

  if (mode === 'windowed_distinct') {
    const table = String(params.table || '').trim()
    if (!mafSchemaIntrospectionIsLogTable(table)) {
      return { ok: false, error: 'windowed_distinct is only valid for syslog, sys_audit, or sys_transaction_pattern' }
    }
    const wh = normalizeWindowHours(params.window_hours)
    if (wh.error) return { ok: false, error: wh.error }
    const df = String(params.distinct_field || '').trim()
    if (!df) return { ok: false, error: 'distinct_field is required' }
    return { ok: true, mode }
  }

  if (mode === 'acl_effectively_open') {
    const table = String(params.table || '').trim()
    if (table !== 'sys_security_acl') return { ok: false, error: 'acl_effectively_open requires table=sys_security_acl' }
    if (!mafSchemaIntrospectionIsAllowlisted(table)) return { ok: false, error: 'table not allowlisted: ' + table }
    return { ok: true, mode }
  }

  return { ok: false, error: 'unknown mode: ' + mode }
}

/**
 * @param {unknown} rawHours
 * @returns {{ hours: number, error?: string }}
 */
export function normalizeWindowHours(rawHours) {
  if (rawHours === undefined || rawHours === null || rawHours === '') {
    return { hours: WINDOW_DEFAULT_HOURS }
  }
  const h = Number(rawHours)
  if (Number.isNaN(h) || h < 1) {
    return { hours: WINDOW_DEFAULT_HOURS, error: 'window_hours must be between 1 and ' + WINDOW_MAX_HOURS }
  }
  if (h > WINDOW_MAX_HOURS) {
    return { hours: WINDOW_DEFAULT_HOURS, error: 'window_hours exceeds maximum (' + WINDOW_MAX_HOURS + 'h)' }
  }
  return { hours: h }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MAF_SCHEMA_INTROSPECTION_ALLOWLIST,
    MAF_SCHEMA_INTROSPECTION_LOG_TABLES,
    mafSchemaIntrospectionIsAllowlisted,
    mafSchemaIntrospectionIsLogTable,
    validateSchemaIntrospectionParams,
    normalizeWindowHours,
  }
}
