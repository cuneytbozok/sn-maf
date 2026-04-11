import assert from 'node:assert/strict'
import test from 'node:test'
import {
  MAF_SCHEMA_INTROSPECTION_ALLOWLIST,
  validateSchemaIntrospectionParams,
  normalizeWindowHours,
} from '../src/pure/mafSchemaIntrospection.js'

test('allowlist length matches PRD §5.3 (+ sys_archive)', () => {
  assert.equal(MAF_SCHEMA_INTROSPECTION_ALLOWLIST.length, 23)
})

test('mode count: valid params', () => {
  const v = validateSchemaIntrospectionParams({
    mode: 'count',
    table: 'sys_trigger',
    filter: 'state=error',
  })
  assert.equal(v.ok, true)
})

test('mode count: reject non-allowlisted table', () => {
  const v = validateSchemaIntrospectionParams({ mode: 'count', table: 'incident' })
  assert.equal(v.ok, false)
})

test('mode count: log table accepts default window (validated via normalizeWindowHours)', () => {
  const v = validateSchemaIntrospectionParams({ mode: 'count', table: 'syslog', filter: 'level=error' })
  assert.equal(v.ok, true)
})

test('mode count: log table rejects window_hours > 168', () => {
  const v = validateSchemaIntrospectionParams({ mode: 'count', table: 'syslog', window_hours: 200 })
  assert.equal(v.ok, false)
})

test('mode group_collision: requires group_by', () => {
  const bad = validateSchemaIntrospectionParams({ mode: 'group_collision', table: 'sys_script', filter: 'active=true' })
  assert.equal(bad.ok, false)
  const good = validateSchemaIntrospectionParams({
    mode: 'group_collision',
    table: 'sys_script',
    filter: 'active=true',
    group_by: 'collection,order',
    min_group_size: 2,
  })
  assert.equal(good.ok, true)
})

test('mode row_count_over_threshold: requires fields and cap', () => {
  const bad = validateSchemaIntrospectionParams({
    mode: 'row_count_over_threshold',
    metadata_table: 'sys_db_object',
    row_threshold: 1,
    max_tables_scanned: 100,
  })
  assert.equal(bad.ok, false)
  const good = validateSchemaIntrospectionParams({
    mode: 'row_count_over_threshold',
    metadata_table: 'sys_db_object',
    metadata_name_field: 'name',
    metadata_filter: 'nameISNOTEMPTY',
    row_threshold: 1000000,
    max_tables_scanned: 500,
  })
  assert.equal(good.ok, true)
})

test('mode windowed_count: only log tables', () => {
  const bad = validateSchemaIntrospectionParams({
    mode: 'windowed_count',
    table: 'sys_trigger',
    filter: 'state=error',
    window_hours: 24,
  })
  assert.equal(bad.ok, false)
  const good = validateSchemaIntrospectionParams({
    mode: 'windowed_count',
    table: 'syslog',
    filter: 'level=error',
    window_field: 'sys_created_on',
    window_hours: 24,
  })
  assert.equal(good.ok, true)
})

test('normalizeWindowHours: default 24, max 168 error', () => {
  assert.equal(normalizeWindowHours(undefined).hours, 24)
  assert.ok(normalizeWindowHours(200).error)
})

test('mode windowed_distinct: requires distinct_field', () => {
  const bad = validateSchemaIntrospectionParams({
    mode: 'windowed_distinct',
    table: 'syslog',
    filter: 'level=error',
    window_hours: 24,
  })
  assert.equal(bad.ok, false)
  const good = validateSchemaIntrospectionParams({
    mode: 'windowed_distinct',
    table: 'syslog',
    filter: 'level=error',
    distinct_field: 'message',
    window_hours: 24,
  })
  assert.equal(good.ok, true)
})

test('mode acl_effectively_open: requires sys_security_acl', () => {
  const bad = validateSchemaIntrospectionParams({ mode: 'acl_effectively_open', table: 'syslog' })
  assert.equal(bad.ok, false)
  const good = validateSchemaIntrospectionParams({
    mode: 'acl_effectively_open',
    table: 'sys_security_acl',
    filter: 'active=true^scriptISEMPTY^conditionISEMPTY',
  })
  assert.equal(good.ok, true)
})

test('mode row_count_over_threshold: require_no_active_archive validates archive table', () => {
  const bad = validateSchemaIntrospectionParams({
    mode: 'row_count_over_threshold',
    metadata_table: 'sys_db_object',
    metadata_name_field: 'name',
    row_threshold: 1000000,
    max_tables_scanned: 500,
    require_no_active_archive: true,
    archive_rule_table: 'foo',
  })
  assert.equal(bad.ok, false)
})
