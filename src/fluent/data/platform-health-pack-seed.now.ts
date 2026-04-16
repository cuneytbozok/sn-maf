import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

/**
 * Platform Health pack (PRD §6) — `platform_health` category, nine sub-categories, 61 active metrics.
 * ITSM boundary (§6.2): instance-wide `sys_script` metrics append
 * `^collection!=incident^collection!=change_request^collection!=problem` to filters.
 */

const SP_PERF_01 = JSON.stringify({
  mode: 'windowed_count',
  table: 'sys_transaction_pattern',
  filter: 'response_time>5000',
  window_field: 'sys_created_on',
  window_hours: 24,
})
const SP_PERF_02 = JSON.stringify({
  mode: 'count',
  table: 'sys_trigger',
  filter: 'last_run_duration>3600000^state!=ready',
})
const SP_PERF_03 = JSON.stringify({
  mode: 'count',
  table: 'sys_trigger',
  filter: 'state=running^sys_updated_on<javascript:gs.hoursAgoStart(2)',
})
const SP_PERF_04 = JSON.stringify({
  mode: 'windowed_count',
  table: 'syslog',
  filter: 'levelLIKEsemaphore^ORmessageLIKEsemaphore exhausted',
  window_field: 'sys_created_on',
  window_hours: 24,
})
const SP_PERF_05 = JSON.stringify({
  table: 'syslog_transaction',
  numerator_filter: 'error_message!=NULL',
  denominator_filter: 'sys_idISNOTEMPTY',
  window_field: 'sys_created_on',
  window_days: 1,
  empty_denominator_value: 0,
})

const SP_DATA_01 = JSON.stringify({
  mode: 'row_count_over_threshold',
  metadata_table: 'sys_db_object',
  metadata_filter: 'super_class=NULL^name!STARTSWITHsys_^name!STARTSWITHts_',
  metadata_name_field: 'name',
  row_threshold: 10000000,
  max_tables_scanned: 500,
})
const SP_DATA_05 = JSON.stringify({
  mode: 'row_count_over_threshold',
  metadata_table: 'sys_db_object',
  metadata_filter: 'super_class=NULL^name!STARTSWITHsys_^name!STARTSWITHts_',
  metadata_name_field: 'name',
  row_threshold: 1000000,
  max_tables_scanned: 500,
  require_no_active_archive: true,
  archive_rule_table: 'sys_archive',
  archive_match_field: 'collection',
})

const SP_JOB_05 = JSON.stringify({
  mode: 'count',
  table: 'sys_trigger',
  filter:
    'last_run_duration>300000^sys_updated_on>=javascript:gs.daysAgoStart(7)^system_idISEMPTY',
})

const SP_BR_01 = JSON.stringify({
  mode: 'count',
  table: 'sys_script',
  filter:
    'when=before^active=true^scriptLIKERESTMessage^ORscriptLIKEGlideHTTPRequest^collection!=incident^collection!=change_request^collection!=problem',
})
const SP_BR_02 = JSON.stringify({
  mode: 'group_collision',
  table: 'sys_script',
  filter:
    'active=true^when=before^collection!=incident^collection!=change_request^collection!=problem',
  group_by: 'collection,when,order',
  min_group_size: 2,
})
const SP_BR_04 = JSON.stringify({
  mode: 'count',
  table: 'sys_script',
  filter:
    'description=NULL^active=true^sys_packageNOT LIKEservicenow^collection!=incident^collection!=change_request^collection!=problem',
})

const SP_US_03 = JSON.stringify({
  collection_mode: 'parent_without_matching_children',
  parent_table: 'sys_update_set',
  parent_filter: 'state=complete^nameNOT LIKEDefault',
  child_table: 'sys_update_xml',
  child_parent_field: 'update_set',
  child_match_filter: 'sys_scope.scope!=global',
})

const SP_FOOT_05 = JSON.stringify({
  mode: 'count',
  table: 'sys_db_object',
  filter: 'nameSTARTSWITHu_^super_classISEMPTY',
})

const SP_EI_02 = JSON.stringify({
  mode: 'count',
  table: 'sys_email',
  filter: 'type=received^stateLIKEerror^sys_created_on>=javascript:gs.daysAgoStart(7)',
})
const SP_EI_04 = JSON.stringify({
  mode: 'windowed_count',
  table: 'syslog',
  filter: 'source=RESTMessageV2^levelLIKEerror',
  window_field: 'sys_created_on',
  window_hours: 24,
})

const SP_SEC_04 = JSON.stringify({
  mode: 'acl_effectively_open',
  table: 'sys_security_acl',
  filter: 'active=true^scriptISEMPTY^conditionISEMPTY',
})

const SP_LOG_01 = JSON.stringify({
  mode: 'windowed_distinct',
  table: 'syslog',
  filter: 'level=error',
  window_field: 'sys_created_on',
  window_hours: 24,
  distinct_field: 'message',
})
const SP_LOG_02 = JSON.stringify({
  mode: 'windowed_count',
  table: 'syslog',
  filter: 'level=error^messageLIKEUncaught',
  window_field: 'sys_created_on',
  window_hours: 24,
})
const SP_LOG_03 = JSON.stringify({
  mode: 'windowed_count',
  table: 'syslog',
  filter: 'source=script_include^level=error',
  window_field: 'sys_created_on',
  window_hours: 168,
})
const SP_LOG_04 = JSON.stringify({
  mode: 'windowed_count',
  table: 'syslog',
  filter: 'sourceLIKEbusiness rule^level=error',
  window_field: 'sys_created_on',
  window_hours: 168,
})
const SP_LOG_05 = JSON.stringify({
  table: 'syslog',
  numerator_filter: 'level=error',
  denominator_filter: 'level=warn^ORlevel=warning^ORlevel=error',
  window_field: 'sys_created_on',
  window_days: 1,
  empty_denominator_value: 0,
})

const SP_EI_01 = JSON.stringify({
  table: 'sys_email',
  numerator_filter: 'type=send-failed',
  denominator_filter: 'type=send-ready^ORtype=sent^ORtype=send-failed',
  window_field: 'sys_created_on',
  window_days: 7,
  empty_denominator_value: 0,
})

const SP_SEC_01 = JSON.stringify({
  numerator_table: 'sys_user_has_role',
  numerator_filter:
    'role.name=admin^user.active=true^user.last_login<javascript:gs.daysAgoStart(90)',
  denominator_table: 'sys_user_has_role',
  denominator_filter: 'role.name=admin^user.active=true',
  empty_denominator_value: 0,
})

const SP_SEC_MGR_DENY = JSON.stringify({
  property_primary: 'glide.script.policy.security_manager.default',
  expected_deny_values: 'deny,restrictive',
})
const SP_US_SIZE_500 = JSON.stringify({
  max_records: 500,
  skip_default_named: true,
})
const SP_CHANGE_BLACKOUT = JSON.stringify({
  tables: ['cmn_schedule_blackout'],
})
const SP_PROD_CLONE_SAFE = JSON.stringify({})

Record({
  $id: Now.ID['maf_plathealth_pack'],
  table: 'x_maf_core_pack',
  data: {
    name: 'platform_health',
    label: 'Platform Health',
    description:
      'Instance-wide platform sustainability and hygiene (MAF Platform Health pack v1, PRD §6).',
    version: '1.0.0',
    vendor: 'MAF Core',
    active: true,
    order: 110,
  },
})

Record({
  $id: Now.ID['maf_plathealth_cat'],
  table: 'x_maf_core_category',
  data: {
    pack: Now.ref('x_maf_core_pack', 'maf_plathealth_pack'),
    name: 'platform_health',
    label: 'Platform Health',
    description:
      'Single category for the Platform Health pack: performance, data, jobs, business rules, update sets, footprint, integrations, security, and logging (PRD §6.1).',
    weight: 1,
    order: 1,
  },
})

Record({
  $id: Now.ID['maf_plathealth_sub_performance'],
  table: 'x_maf_core_sub_category',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    name: 'platform_performance',
    label: 'Instance performance',
    description: 'Slow transactions, job runtime, semaphores, and transaction error rate (PRD §6.3.1).',
    weight_in_category: 0.12,
    order: 1,
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_sub_data_volume'],
  table: 'x_maf_core_sub_category',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    name: 'platform_data_volume',
    label: 'Data volume & retention',
    description: 'Large tables, email/audit/history volume, and archive hygiene (PRD §6.3.2).',
    weight_in_category: 0.1,
    order: 2,
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_sub_scheduled_jobs'],
  table: 'x_maf_core_sub_category',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    name: 'platform_scheduled_jobs',
    label: 'Scheduled job health',
    description: 'Job errors, run-as, documentation, schedule drift, and long runtimes (PRD §6.3.3).',
    weight_in_category: 0.1,
    order: 3,
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_sub_business_rules'],
  table: 'x_maf_core_sub_category',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    name: 'platform_business_rules',
    label: 'Business rule sanity',
    description:
      'Anti-patterns and volume signals for instance-wide business rules (PRD §6.3.4). ITSM §6.2: excludes incident/change/problem table scope.',
    weight_in_category: 0.12,
    order: 4,
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_sub_update_sets'],
  table: 'x_maf_core_sub_category',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    name: 'platform_update_sets',
    label: 'Update set discipline',
    description: 'Age, description, empty sets, conflicts, and batch usage (PRD §6.3.5).',
    weight_in_category: 0.1,
    order: 5,
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_sub_footprint'],
  table: 'x_maf_core_sub_category',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    name: 'platform_footprint',
    label: 'Plugin & app footprint',
    description: 'Scoped apps, global metadata, plugins, store apps, and custom tables — light-touch scoring (PRD §6.3.6).',
    weight_in_category: 0.06,
    order: 6,
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_sub_email_integration'],
  table: 'x_maf_core_sub_category',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    name: 'platform_email_integration',
    label: 'Email & integration health',
    description: 'Outbound/inbound email, REST auth, REST syslog errors, and notification templates (PRD §6.3.7).',
    weight_in_category: 0.1,
    order: 7,
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_sub_security'],
  table: 'x_maf_core_sub_category',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    name: 'platform_security',
    label: 'Security hygiene',
    description: 'Admins, role expiry, ACL scope, open ACLs, OOTB ACL edits, and inactive users (PRD §6.3.8).',
    weight_in_category: 0.15,
    order: 8,
    active: true,
  },
})

// New sub-category to host manual / discovery-workshop metrics. Weight 0.05
// was taken from Security hygiene (0.20 → 0.15) so category weights still
// sum to 1.0. Kept intentionally small because manual metrics are qualitative
// signals gathered from the consultant, not platform-derived evidence.
Record({
  $id: Now.ID['maf_plathealth_sub_governance_manual'],
  table: 'x_maf_core_sub_category',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    name: 'platform_governance_manual',
    label: 'Governance & adoption (manual)',
    description:
      'Qualitative governance and adoption signals captured by the consultant during the discovery workshop (PRD §9.4 manual collector).',
    weight_in_category: 0.05,
    order: 10,
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_sub_logging_errors'],
  table: 'x_maf_core_sub_category',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    name: 'platform_logging_errors',
    label: 'Logging & error rates',
    description: 'Distinct syslog errors, uncaught exceptions, script/BR errors, and warn/error ratio (PRD §6.3.9).',
    weight_in_category: 0.1,
    order: 9,
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pperf01'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_performance'),
    name: 'p_perf_01_slow_transactions_24h',
    label: 'Slow transaction count (24h)',
    description:
      'Counts sys_transaction_pattern rows with response time over 5s in the last 24h. Windowed to reflect current load. PRD P-PERF-01.',
    collector_type: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    script_params: SP_PERF_01,
    target_value: 10,
    threshold_red: 500,
    threshold_amber: 100,
    higher_is_better: false,
    weight_in_category: 0.2432,
    unit: 'count',
    active: true,
    default_likely_cause:
      'A few heavy transactions (list queries without indexes, rogue scripts, or unbounded workflows) are dominating response time. Database query stats or the slow-query log will usually identify the top offenders.',
    default_suggested_action:
      'Pull the top 10 slow transaction patterns, index the underlying queries or refactor the scripts, and add a performance regression check to the deployment pipeline for any change touching those tables.',
    default_owner_role: 'platform_owner',
    default_effort_tshirt: 'm',
    default_quick_win_flag: false,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pperf02'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_performance'),
    name: 'p_perf_02_long_running_jobs',
    label: 'Long-running scheduled jobs (wall clock > 1h)',
    description:
      'sys_trigger rows where last_run_duration exceeds 3600000 ms (1 hour) and state is not ready. PRD P-PERF-02; duration compared as stored on instance.',
    collector_type: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    script_params: SP_PERF_02,
    target_value: 0,
    threshold_red: 20,
    threshold_amber: 5,
    higher_is_better: false,
    weight_in_category: 0.2052,
    unit: 'count',
    active: true,
    default_likely_cause:
      'Scheduled jobs that were fine at one data volume are now processing much larger sets without batching, or a job is waiting on a remote call with no timeout. Stuck workers can also keep duration climbing across restarts.',
    default_suggested_action:
      'Review the top offending sys_trigger entries, add batching and cancellation guards to their scripts, and move the genuinely long workloads to dedicated nodes with explicit progress logging.',
    default_owner_role: 'platform_owner',
    default_effort_tshirt: 'l',
    default_quick_win_flag: false,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pperf03'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_performance'),
    name: 'p_perf_03_jobs_stuck_running',
    label: 'Jobs stuck in running state (>2h)',
    description:
      'Scheduled jobs in running state with sys_updated_on older than 2 hours. PRD P-PERF-03.',
    collector_type: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    script_params: SP_PERF_03,
    target_value: 0,
    threshold_red: 3,
    threshold_amber: 1,
    higher_is_better: false,
    weight_in_category: 0.2052,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pperf04'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_performance'),
    name: 'p_perf_04_semaphore_syslog_24h',
    label: 'Semaphore exhaustion events (24h)',
    description:
      'Syslog rows mentioning semaphore exhaustion in the last 24h. PRD P-PERF-04.',
    collector_type: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    script_params: SP_PERF_04,
    target_value: 0,
    threshold_red: 10,
    threshold_amber: 1,
    higher_is_better: false,
    weight_in_category: 0.12,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pperf05'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_performance'),
    name: 'p_perf_05_transaction_log_error_rate',
    label: 'Transaction log error rate (24h)',
    description:
      'Percentage of syslog_transaction rows in the last 24h with error_message populated. PRD P-PERF-05.',
    collector_type: 'script_include',
    script_include: 'MAFWindowedRatioCollector',
    script_params: SP_PERF_05,
    target_value: 0.1,
    threshold_red: 2,
    threshold_amber: 0.5,
    higher_is_better: false,
    weight_in_category: 0.12,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pdata01'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_data_volume'),
    name: 'p_data_01_tables_over_10m_rows',
    label: 'Tables over 10M rows',
    description:
      'Counts non-system base tables whose row count exceeds 10M (metadata walk capped). PRD P-DATA-01.',
    collector_type: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    script_params: SP_DATA_01,
    target_value: 1,
    threshold_red: 5,
    threshold_amber: 2,
    higher_is_better: false,
    weight_in_category: 0.2,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pdata02'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_data_volume'),
    name: 'p_data_02_sys_email_row_count',
    label: 'sys_email row count',
    description:
      'Total rows in sys_email — unbounded growth indicator. PRD P-DATA-02.',
    collector_type: 'declarative',
    source_table: 'sys_email',
    filter_condition: 'sys_idISNOTEMPTY',
    aggregation: 'count',
    target_value: 500000,
    threshold_red: 5000000,
    threshold_amber: 1000000,
    higher_is_better: false,
    weight_in_category: 0.17,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pdata03'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_data_volume'),
    name: 'p_data_03_sys_audit_row_count',
    label: 'sys_audit row count',
    description: 'Total rows in sys_audit. PRD P-DATA-03.',
    collector_type: 'declarative',
    source_table: 'sys_audit',
    filter_condition: 'sys_idISNOTEMPTY',
    aggregation: 'count',
    target_value: 5000000,
    threshold_red: 50000000,
    threshold_amber: 10000000,
    higher_is_better: false,
    weight_in_category: 0.12,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pdata04'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_data_volume'),
    name: 'p_data_04_sys_history_line_row_count',
    label: 'sys_history_line row count',
    description: 'Total rows in sys_history_line. PRD P-DATA-04.',
    collector_type: 'declarative',
    source_table: 'sys_history_line',
    filter_condition: 'sys_idISNOTEMPTY',
    aggregation: 'count',
    target_value: 5000000,
    threshold_red: 50000000,
    threshold_amber: 10000000,
    higher_is_better: false,
    weight_in_category: 0.12,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pdata05'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_data_volume'),
    name: 'p_data_05_large_tables_without_archive',
    label: 'Large tables without active archive rule',
    description:
      'Counts base tables over 1M rows with no active sys_archive rule for the same collection name (archive_match_field=collection). PRD P-DATA-05; uses require_no_active_archive on row_count_over_threshold.',
    collector_type: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    script_params: SP_DATA_05,
    target_value: 1,
    threshold_red: 10,
    threshold_amber: 3,
    higher_is_better: false,
    weight_in_category: 0.21,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pjob01'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_scheduled_jobs'),
    name: 'p_job_01_errors_7d',
    label: 'Scheduled jobs in error (7d)',
    description: 'sys_trigger in error state updated in the last 7 days. PRD P-JOB-01.',
    collector_type: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    script_params: JSON.stringify({
      mode: 'count',
      table: 'sys_trigger',
      filter: 'state=error^sys_updated_on>=javascript:gs.daysAgoStart(7)',
    }),
    target_value: 0,
    threshold_red: 20,
    threshold_amber: 5,
    higher_is_better: false,
    weight_in_category: 0.25,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pjob02'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_scheduled_jobs'),
    name: 'p_job_02_run_as_admin',
    label: 'Jobs running as System Administrator',
    description: 'PRD P-JOB-02.',
    collector_type: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    script_params: JSON.stringify({
      mode: 'count',
      table: 'sys_trigger',
      filter: 'run_as.user_name=admin^system_idISEMPTY',
    }),
    target_value: 5,
    threshold_red: 50,
    threshold_amber: 20,
    higher_is_better: false,
    weight_in_category: 0.2,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pjob03'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_scheduled_jobs'),
    name: 'p_job_03_no_description',
    label: 'Scheduled jobs with no description',
    description: 'PRD P-JOB-03.',
    collector_type: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    script_params: JSON.stringify({
      mode: 'count',
      table: 'sys_trigger',
      filter: 'description=NULL^system_idISEMPTY',
    }),
    target_value: 3,
    threshold_red: 30,
    threshold_amber: 10,
    higher_is_better: false,
    weight_in_category: 0.15,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pjob04'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_scheduled_jobs'),
    name: 'p_job_04_next_action_past',
    label: 'Ready jobs with next action over 1h in the past',
    description: 'PRD P-JOB-04.',
    collector_type: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    script_params: JSON.stringify({
      mode: 'count',
      table: 'sys_trigger',
      filter: 'next_actionRELATIVELT@second@ago@3600^state=ready',
    }),
    target_value: 0,
    threshold_red: 5,
    threshold_amber: 1,
    higher_is_better: false,
    weight_in_category: 0.2,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pjob05'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_scheduled_jobs'),
    name: 'p_job_05_long_last_run_duration_7d',
    label: 'Jobs with last run over 5 minutes (7d)',
    description:
      'Counts scheduled jobs (non-system) with last_run_duration over 300000 ms in the last 7 days. PRD P-JOB-05; implemented as count (not group_collision).',
    collector_type: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    script_params: SP_JOB_05,
    target_value: 3,
    threshold_red: 30,
    threshold_amber: 10,
    higher_is_better: false,
    weight_in_category: 0.2,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pbr01'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_business_rules'),
    name: 'p_br_01_before_br_http',
    label: 'Before-BR synchronous HTTP / outbound calls',
    description:
      'PRD P-BR-01. ITSM §6.2: excludes business rules on incident, change_request, problem (collection filter).',
    collector_type: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    script_params: SP_BR_01,
    target_value: 0,
    threshold_red: 1,
    threshold_amber: 0,
    higher_is_better: false,
    weight_in_category: 0.255,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pbr02'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_business_rules'),
    name: 'p_br_02_duplicate_order_collision',
    label: 'Business rules with duplicate order (same table/phase)',
    description: 'PRD P-BR-02. ITSM §6.2: excludes ITSM table scopes via filter.',
    collector_type: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    script_params: SP_BR_02,
    target_value: 1,
    threshold_red: 10,
    threshold_amber: 3,
    higher_is_better: false,
    weight_in_category: 0.17,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pbr03'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_business_rules'),
    name: 'p_br_03_async_br_count',
    label: 'Active async business rules (instance-wide)',
    description:
      'PRD P-BR-03. ITSM §6.2: excludes incident, change_request, problem collections.',
    collector_type: 'declarative',
    source_table: 'sys_script',
    filter_condition:
      'active=true^when=async^collection!=incident^collection!=change_request^collection!=problem',
    aggregation: 'count',
    target_value: 100,
    threshold_red: 500,
    threshold_amber: 200,
    higher_is_better: false,
    weight_in_category: 0.1275,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pbr04'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_business_rules'),
    name: 'p_br_04_undocumented_custom_br',
    label: 'Custom business rules with no description',
    description: 'PRD P-BR-04. ITSM §6.2: excludes ITSM table scopes.',
    collector_type: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    script_params: SP_BR_04,
    target_value: 10,
    threshold_red: 100,
    threshold_amber: 30,
    higher_is_better: false,
    weight_in_category: 0.1275,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pbr05'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_business_rules'),
    name: 'p_br_05_modified_oob_br',
    label: 'OOTB business rules marked customer-updated',
    description: 'PRD P-BR-05; instance-wide.',
    collector_type: 'declarative',
    source_table: 'sys_script',
    filter_condition:
      'sys_package.sourceLIKEservicenow^sys_update_name!=NULL^sys_updated_byNOT INsystem,admin',
    aggregation: 'count',
    target_value: 5,
    threshold_red: 30,
    threshold_amber: 10,
    higher_is_better: false,
    weight_in_category: 0.17,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pus01'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_update_sets'),
    name: 'p_us_01_open_us_30d',
    label: 'Update sets in progress >30 days',
    description: 'PRD P-US-01.',
    collector_type: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    script_params: JSON.stringify({
      mode: 'count',
      table: 'sys_update_set',
      filter: 'state=in_progress^sys_updated_on<javascript:gs.daysAgoStart(30)^nameNOT LIKEDefault',
    }),
    target_value: 2,
    threshold_red: 20,
    threshold_amber: 5,
    higher_is_better: false,
    weight_in_category: 0.2024,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pus02'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_update_sets'),
    name: 'p_us_02_no_description',
    label: 'Update sets with no description',
    description: 'PRD P-US-02.',
    collector_type: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    script_params: JSON.stringify({
      mode: 'count',
      table: 'sys_update_set',
      filter: 'description=NULL^nameNOT LIKEDefault',
    }),
    target_value: 5,
    threshold_red: 50,
    threshold_amber: 15,
    higher_is_better: false,
    weight_in_category: 0.1656,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pus03'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_update_sets'),
    name: 'p_us_03_complete_us_zero_customer_xml',
    label: 'Complete update sets with no non-global scoped XML',
    description:
      'PRD P-US-03. Counts completed non-Default update sets with no sys_update_xml row where sys_scope is not global (customer-scoped content). Override child_match_filter on your instance if needed.',
    collector_type: 'script_include',
    script_include: 'MAFCrossTableRatioCollector',
    script_params: SP_US_03,
    target_value: 1,
    threshold_red: 10,
    threshold_amber: 3,
    higher_is_better: false,
    weight_in_category: 0.1196,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pus04'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_update_sets'),
    name: 'p_us_04_conflicts_unresolved',
    label: 'In-progress update sets with conflicts',
    description: 'PRD P-US-04; uses conflicts field when present on instance.',
    collector_type: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    script_params: JSON.stringify({
      mode: 'count',
      table: 'sys_update_set',
      filter: 'conflictsISNOTEMPTY^state=in_progress',
    }),
    target_value: 0,
    threshold_red: 5,
    threshold_amber: 1,
    higher_is_better: false,
    weight_in_category: 0.1564,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pus05'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_update_sets'),
    name: 'p_us_05_us_outside_batch_pct',
    label: 'Completed update sets outside a batch (%)',
    description: 'PRD P-US-05.',
    collector_type: 'declarative',
    source_table: 'sys_update_set',
    filter_condition: 'parentISEMPTY^state=complete^nameNOT LIKEDefault',
    aggregation: 'percentage',
    denominator_filter: 'state=complete^nameNOT LIKEDefault',
    target_value: 20,
    threshold_red: 80,
    threshold_amber: 50,
    higher_is_better: false,
    weight_in_category: 0.1656,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pfoot01'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_footprint'),
    name: 'p_foot_01_customer_scoped_apps',
    label: 'Customer-created scoped applications',
    description: 'PRD P-FOOT-01.',
    collector_type: 'declarative',
    source_table: 'sys_app',
    filter_condition: 'scope!=global^sourceNOT LIKEservicenow',
    aggregation: 'count',
    target_value: 10,
    threshold_red: 50,
    threshold_amber: 20,
    higher_is_better: false,
    weight_in_category: 0.152,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pfoot02'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_footprint'),
    name: 'p_foot_02_global_metadata_custom',
    label: 'Global-scope custom metadata records',
    description: 'PRD P-FOOT-02.',
    collector_type: 'declarative',
    source_table: 'sys_metadata',
    filter_condition: 'sys_scope=global^sys_packageNOT LIKEservicenow',
    aggregation: 'count',
    target_value: 500,
    threshold_red: 5000,
    threshold_amber: 2000,
    higher_is_better: false,
    weight_in_category: 0.19,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pfoot03'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_footprint'),
    name: 'p_foot_03_inactive_installed_plugins',
    label: 'Plugins installed but inactive',
    description: 'PRD P-FOOT-03.',
    collector_type: 'declarative',
    source_table: 'v_plugin',
    filter_condition: 'active=false^status=installed',
    aggregation: 'count',
    target_value: 5,
    threshold_red: 30,
    threshold_amber: 10,
    higher_is_better: false,
    weight_in_category: 0.114,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pfoot04'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_footprint'),
    name: 'p_foot_04_store_apps',
    label: 'Store applications installed',
    description: 'PRD P-FOOT-04.',
    collector_type: 'declarative',
    source_table: 'sys_store_app',
    filter_condition: 'sys_idISNOTEMPTY',
    aggregation: 'count',
    target_value: 15,
    threshold_red: 40,
    threshold_amber: 20,
    higher_is_better: false,
    weight_in_category: 0.114,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pfoot05'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_footprint'),
    name: 'p_foot_05_custom_u_tables',
    label: 'Custom tables (u_ prefix, base table)',
    description: 'PRD P-FOOT-05.',
    collector_type: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    script_params: SP_FOOT_05,
    target_value: 50,
    threshold_red: 200,
    threshold_amber: 100,
    higher_is_better: false,
    weight_in_category: 0.19,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pei01'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_email_integration'),
    name: 'p_ei_01_outbound_email_failure_rate',
    label: 'Outbound email failure rate (7d)',
    description: 'PRD P-EI-01.',
    collector_type: 'script_include',
    script_include: 'MAFWindowedRatioCollector',
    script_params: SP_EI_01,
    target_value: 1,
    threshold_red: 10,
    threshold_amber: 3,
    higher_is_better: false,
    weight_in_category: 0.2635,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pei02'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_email_integration'),
    name: 'p_ei_02_inbound_email_errors_7d',
    label: 'Inbound email processing errors (7d)',
    description: 'PRD P-EI-02.',
    collector_type: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    script_params: SP_EI_02,
    target_value: 5,
    threshold_red: 100,
    threshold_amber: 20,
    higher_is_better: false,
    weight_in_category: 0.1615,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pei03'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_email_integration'),
    name: 'p_ei_03_rest_basic_auth_pct',
    label: 'REST messages using Basic Auth (%)',
    description:
      'PRD P-EI-03. Instance-wide; ITSM §6.2: not limited to ITSM tables — outbound REST definitions only.',
    collector_type: 'declarative',
    source_table: 'sys_rest_message',
    filter_condition: 'authentication_type=basic',
    aggregation: 'percentage',
    denominator_filter: 'sys_idISNOTEMPTY',
    target_value: 10,
    threshold_red: 50,
    threshold_amber: 20,
    higher_is_better: false,
    weight_in_category: 0.2125,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pei04'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_email_integration'),
    name: 'p_ei_04_rest_outbound_errors_24h',
    label: 'REST outbound errors in syslog (24h)',
    description: 'PRD P-EI-04.',
    collector_type: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    script_params: SP_EI_04,
    target_value: 20,
    threshold_red: 500,
    threshold_amber: 100,
    higher_is_better: false,
    weight_in_category: 0.15,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pei05'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_email_integration'),
    name: 'p_ei_05_email_actions_no_template',
    label: 'Active email notifications without a template',
    description:
      'PRD P-EI-05. Instance-wide sysevent_email_action rows; ITSM §6.2: not scoped to incident-only notifications — use for platform hygiene of notification authoring.',
    collector_type: 'declarative',
    source_table: 'sysevent_email_action',
    filter_condition: 'active=true^message_templateISEMPTY',
    aggregation: 'count',
    target_value: 3,
    threshold_red: 30,
    threshold_amber: 10,
    higher_is_better: false,
    weight_in_category: 0.2125,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_psec01'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_security'),
    name: 'p_sec_01_dormant_admin_ratio',
    label: 'Dormant admin users (90d) as % of active admins',
    description: 'PRD P-SEC-01.',
    collector_type: 'script_include',
    script_include: 'MAFCrossTableRatioCollector',
    script_params: SP_SEC_01,
    target_value: 0,
    threshold_red: 20,
    threshold_amber: 5,
    higher_is_better: false,
    weight_in_category: 0.17,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_psec02'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_security'),
    name: 'p_sec_02_admin_role_no_expiration',
    label: 'Admin role grants without expiration',
    description: 'PRD P-SEC-02.',
    collector_type: 'declarative',
    source_table: 'sys_user_has_role',
    filter_condition: 'role.name=admin^expires_atISEMPTY',
    aggregation: 'count',
    target_value: 2,
    threshold_red: 20,
    threshold_amber: 5,
    higher_is_better: false,
    weight_in_category: 0.17,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_psec03'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_security'),
    name: 'p_sec_03_global_acl_scoped_tables',
    label: 'Global-scope ACLs on scoped table names',
    description: 'PRD P-SEC-03.',
    collector_type: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    script_params: JSON.stringify({
      mode: 'count',
      table: 'sys_security_acl',
      filter: 'sys_scope=global^nameLIKEx_',
    }),
    target_value: 0,
    threshold_red: 10,
    threshold_amber: 3,
    higher_is_better: false,
    weight_in_category: 0.1275,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_psec04'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_security'),
    name: 'p_sec_04_acl_open_no_roles',
    label: 'ACLs with no script, no condition, and no roles',
    description:
      'PRD P-SEC-04. acl_effectively_open mode: counts sys_security_acl rows matching filter with no sys_security_acl_role rows (two-pass; no subquery).',
    collector_type: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    script_params: SP_SEC_04,
    target_value: 0,
    threshold_red: 10,
    threshold_amber: 2,
    higher_is_better: false,
    weight_in_category: 0.1275,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_psec05'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_security'),
    name: 'p_sec_05_modified_oob_acl',
    label: 'OOTB ACLs marked customer-updated',
    description: 'PRD P-SEC-05.',
    collector_type: 'declarative',
    source_table: 'sys_security_acl',
    filter_condition:
      'sys_packageLIKEservicenow^sys_update_name!=NULL^sys_updated_byNOT INsystem,admin',
    aggregation: 'count',
    target_value: 2,
    threshold_red: 15,
    threshold_amber: 5,
    higher_is_better: false,
    weight_in_category: 0.1275,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_psec06'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_security'),
    name: 'p_sec_06_inactive_user_recent_role',
    label: 'Inactive users with role grants in last 30 days',
    description: 'PRD P-SEC-06.',
    collector_type: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    script_params: JSON.stringify({
      mode: 'count',
      table: 'sys_user_has_role',
      filter: 'user.active=false^sys_created_on>=javascript:gs.daysAgoStart(30)',
    }),
    target_value: 0,
    threshold_red: 5,
    threshold_amber: 1,
    higher_is_better: false,
    weight_in_category: 0.1275,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_plog01'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_logging_errors'),
    name: 'p_log_01_distinct_error_messages_24h',
    label: 'Distinct error messages in syslog (24h)',
    description:
      'PRD P-LOG-01. windowed_distinct mode groups by message within the time window — surfaces breadth of failures vs raw volume.',
    collector_type: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    script_params: SP_LOG_01,
    target_value: 10,
    threshold_red: 100,
    threshold_amber: 30,
    higher_is_better: false,
    weight_in_category: 0.1667,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_plog02'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_logging_errors'),
    name: 'p_log_02_uncaught_exceptions_24h',
    label: 'Uncaught exceptions in syslog (24h)',
    description: 'PRD P-LOG-02.',
    collector_type: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    script_params: SP_LOG_02,
    target_value: 2,
    threshold_red: 50,
    threshold_amber: 10,
    higher_is_better: false,
    weight_in_category: 0.1667,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_plog03'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_logging_errors'),
    name: 'p_log_03_script_include_errors_7d',
    label: 'Script include execution errors (7d)',
    description: 'PRD P-LOG-03.',
    collector_type: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    script_params: SP_LOG_03,
    target_value: 5,
    threshold_red: 100,
    threshold_amber: 20,
    higher_is_better: false,
    weight_in_category: 0.1667,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_plog04'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_logging_errors'),
    name: 'p_log_04_business_rule_errors_7d',
    label: 'Business rule execution errors (7d)',
    description: 'PRD P-LOG-04.',
    collector_type: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    script_params: SP_LOG_04,
    target_value: 5,
    threshold_red: 100,
    threshold_amber: 20,
    higher_is_better: false,
    weight_in_category: 0.1667,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_plog05'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_logging_errors'),
    name: 'p_log_05_warn_to_error_ratio',
    label: 'Error share of warn+error syslog entries (24h)',
    description:
      'Percentage of error-level entries among all warning+error syslog rows in the last 24h. Lower is better — a high ratio means errors dominate over warnings, suggesting unhandled failures rather than anticipated conditions. PRD P-LOG-05.',
    collector_type: 'script_include',
    script_include: 'MAFWindowedRatioCollector',
    script_params: SP_LOG_05,
    target_value: 10,
    threshold_red: 40,
    threshold_amber: 20,
    higher_is_better: false,
    weight_in_category: 0.1667,
    unit: '%',
    active: true,
  },
})

/**
 * New Instance Performance metric (v1.1) — MID server availability.
 */
Record({
  $id: Now.ID['maf_plathealth_m_pperf06'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_performance'),
    name: 'p_perf_06_mid_server_down',
    label: 'MID servers in down or error state',
    description:
      'Counts ecc_agent rows where status is not Up. Critical for integration, discovery, and orchestration health. Zero is ideal.',
    collector_type: 'declarative',
    source_table: 'ecc_agent',
    filter_condition: 'status!=Up',
    aggregation: 'count',
    target_value: 0,
    threshold_red: 3,
    threshold_amber: 1,
    higher_is_better: false,
    weight_in_category: 0.1064,
    unit: 'count',
    active: true,
  },
})

/**
 * New Data Volume metrics (v1.1) — attachment sprawl and import set hygiene.
 */
Record({
  $id: Now.ID['maf_plathealth_m_pdata06'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_data_volume'),
    name: 'p_data_06_attachment_row_count',
    label: 'sys_attachment row count',
    description:
      'Total rows in sys_attachment. Attachments are a major storage consumer and performance drag. Unbounded growth indicates missing retention rules or excessive attachment usage.',
    collector_type: 'declarative',
    source_table: 'sys_attachment',
    filter_condition: 'sys_idISNOTEMPTY',
    aggregation: 'count',
    target_value: 500000,
    threshold_red: 5000000,
    threshold_amber: 2000000,
    higher_is_better: false,
    weight_in_category: 0.10,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pdata07'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_data_volume'),
    name: 'p_data_07_import_set_stale_90d',
    label: 'Import set rows older than 90 days',
    description:
      'Counts sys_import_set rows with sys_created_on older than 90 days. Import sets are a common source of unbounded table growth when cleanup rules are not configured.',
    collector_type: 'declarative',
    source_table: 'sys_import_set',
    filter_condition: 'sys_created_on<javascript:gs.daysAgoStart(90)',
    aggregation: 'count',
    target_value: 100,
    threshold_red: 5000,
    threshold_amber: 1000,
    higher_is_better: false,
    weight_in_category: 0.08,
    unit: 'count',
    active: true,
  },
})

/**
 * New Update Set metric (v1.1) — upgrade readiness via skipped records.
 */
Record({
  $id: Now.ID['maf_plathealth_m_pus06'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_update_sets'),
    name: 'p_us_06_skipped_records',
    label: 'Skipped upgrade records',
    description:
      'Counts sys_upgrade_history_log rows with type=skipped. Skipped records accumulate technical debt across upgrades and may block future upgrade paths. Review and resolve regularly.',
    collector_type: 'declarative',
    source_table: 'sys_upgrade_history_log',
    filter_condition: 'type=skipped',
    aggregation: 'count',
    target_value: 10,
    threshold_red: 200,
    threshold_amber: 50,
    higher_is_better: false,
    weight_in_category: 0.1104,
    unit: 'count',
    active: true,
  },
})

/**
 * New Plugin & App Footprint metrics (v1.1) — UI page and property sprawl.
 */
Record({
  $id: Now.ID['maf_plathealth_m_pfoot06'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_footprint'),
    name: 'p_foot_06_custom_ui_pages',
    label: 'Active custom UI pages',
    description:
      'Counts active sys_ui_page rows from non-ServiceNow packages. Legacy UI pages represent technical debt — should be replaced with Service Portal widgets or Workspace experiences.',
    collector_type: 'declarative',
    source_table: 'sys_ui_page',
    filter_condition: 'active=true^sys_packageNOT LIKEservicenow',
    aggregation: 'count',
    target_value: 20,
    threshold_red: 100,
    threshold_amber: 50,
    higher_is_better: false,
    weight_in_category: 0.095,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_pfoot07'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_footprint'),
    name: 'p_foot_07_custom_sys_properties',
    label: 'Custom system properties',
    description:
      'Counts sys_properties rows from non-ServiceNow packages. Uncontrolled property sprawl makes instances hard to manage and upgrade. Excludes OOTB properties.',
    collector_type: 'declarative',
    source_table: 'sys_properties',
    filter_condition: 'sys_packageNOT LIKEservicenow^nameNOT STARTSWITHglide.',
    aggregation: 'count',
    target_value: 100,
    threshold_red: 500,
    threshold_amber: 250,
    higher_is_better: false,
    weight_in_category: 0.095,
    unit: 'count',
    active: true,
  },
})

/**
 * New Logging metric (v1.1) — Flow Designer execution health.
 */
Record({
  $id: Now.ID['maf_plathealth_m_plog06'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_logging_errors'),
    name: 'p_log_06_flow_designer_errors_7d',
    label: 'Flow Designer execution errors (7d)',
    description:
      'Counts sys_flow_context rows with state=error in the last 7 days. Flows are the strategic automation direction in ServiceNow — monitoring their error rate is essential for platform health.',
    collector_type: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    script_params: JSON.stringify({
      mode: 'count',
      table: 'sys_flow_context',
      filter: 'state=error^sys_created_on>=javascript:gs.daysAgoStart(7)',
    }),
    target_value: 5,
    threshold_red: 100,
    threshold_amber: 25,
    higher_is_better: false,
    weight_in_category: 0.1665,
    unit: 'count',
    active: true,
  },
})

/** Phase 1 gap metrics — global BR/CS, update set size, Security Manager, plugins, clone safety, change blackout */
Record({
  $id: Now.ID['maf_plathealth_m_ph_global_br'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_business_rules'),
    name: 'global_business_rules_count',
    label: 'Global table business rules (count)',
    description:
      'Count of active business rules on the global table. Excessive global rules hurt maintainability and upgrade safety (Scan Engine alignment). Lower is better.',
    collector_type: 'declarative',
    source_table: 'sys_script',
    filter_condition: 'active=true^collection=global',
    aggregation: 'count',
    target_value: 5,
    threshold_red: 80,
    threshold_amber: 30,
    higher_is_better: false,
    weight_in_category: 0.05,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_ph_global_cs'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_business_rules'),
    name: 'global_client_scripts_count',
    label: 'Global table client scripts (count)',
    description:
      'Count of active client scripts on the global table. High counts increase regression risk (Scan Engine alignment). Lower is better.',
    collector_type: 'declarative',
    source_table: 'sys_client_script',
    filter_condition: 'active=true^table=global',
    aggregation: 'count',
    target_value: 5,
    threshold_red: 100,
    threshold_amber: 40,
    higher_is_better: false,
    weight_in_category: 0.05,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_ph_change_blackout'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_business_rules'),
    name: 'change_conflict_blackout_enabled',
    label: 'Change blackout windows configured',
    description:
      'Count of active blackout rows (e.g. cmn_schedule_blackout). Higher suggests governance windows are configured (sn_SE10308).',
    collector_type: 'script_include',
    script_include: 'MAFChangeBlackoutCollector',
    script_params: SP_CHANGE_BLACKOUT,
    target_value: 5,
    threshold_red: 0,
    threshold_amber: 1,
    higher_is_better: true,
    weight_in_category: 0.05,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_ph_us_500'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_update_sets'),
    name: 'update_set_over_500_records',
    label: 'Update sets exceeding 500 records',
    description:
      'Count of complete or in-progress update sets with more than 500 sys_update_xml rows (sn_SE10007). Lower is better.',
    collector_type: 'script_include',
    script_include: 'MAFUpdateSetSizeViolationCollector',
    script_params: SP_US_SIZE_500,
    target_value: 0,
    threshold_red: 25,
    threshold_amber: 5,
    higher_is_better: false,
    weight_in_category: 0.08,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_ph_sec_mgr_deny'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_security'),
    name: 'security_manager_deny_mode',
    label: 'Security Manager default mode is deny',
    description:
      'Security Manager / script policy should default to deny for unlisted APIs. 100 when deny mode is active (sn_SE10085).',
    collector_type: 'script_include',
    script_include: 'MAFSecurityManagerDenyCollector',
    script_params: SP_SEC_MGR_DENY,
    target_value: 100,
    threshold_red: 0,
    threshold_amber: 50,
    higher_is_better: true,
    weight_in_category: 0.05,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_ph_high_sec_plugin'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_security'),
    name: 'high_security_plugin_active',
    label: 'High Security plugin active',
    description:
      'v_plugin id=com.glide.hsp active=true (sn_SE10045). Confirm id on your release if different.',
    collector_type: 'declarative',
    source_table: 'v_plugin',
    filter_condition: 'id=com.glide.hsp^active=true',
    aggregation: 'count',
    target_value: 1,
    threshold_red: 0,
    threshold_amber: 0,
    higher_is_better: true,
    weight_in_category: 0.05,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_ph_clone_safe'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_security'),
    name: 'production_clone_target_safe',
    label: 'Production clone target safety',
    description:
      'Production should not expose risky clone-target configuration (sn_SE10087). 100 when safe per property checks.',
    collector_type: 'script_include',
    script_include: 'MAFProductionCloneSafetyCollector',
    script_params: SP_PROD_CLONE_SAFE,
    target_value: 100,
    threshold_red: 0,
    threshold_amber: 50,
    higher_is_better: true,
    weight_in_category: 0.05,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_ph_sow_itsm'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_footprint'),
    name: 'sow_itsm_plugin_active',
    label: 'Service Operations Workspace (ITSM) plugin active',
    description:
      'v_plugin for SOW ITSM; id may vary by family — verify in Plugins (e.g. com.sn_sow_itsm).',
    collector_type: 'declarative',
    source_table: 'v_plugin',
    filter_condition: 'id=com.sn_sow_itsm^active=true',
    aggregation: 'count',
    target_value: 1,
    threshold_red: 0,
    threshold_amber: 0,
    higher_is_better: true,
    weight_in_category: 0.05,
    unit: 'count',
    active: true,
  },
})

// ---------------------------------------------------------------------------
// Manual / discovery metrics (PRD §9.4 — MVP manual collector)
//
// Each metric is a qualitative signal the consultant answers during the
// discovery workshop. raw_value is entered on the form as a 0/1 (boolean) or
// 0..5 Likert; thresholds below map that answer into RAG. Weights within the
// new sub-category sum to 1.0. Advisory defaults are populated so the AI
// summary provider has curated text to anchor on even before the consultant
// has responded.
// ---------------------------------------------------------------------------

Record({
  $id: Now.ID['maf_plathealth_m_manual_governance_board'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_governance_manual'),
    name: 'manual_governance_board_in_place',
    label: 'Platform governance board in place',
    description:
      'Does the customer have a regular platform governance board (demand intake, prioritization, change oversight)? Answer 1 if yes, 0 if no.',
    collector_type: 'manual',
    manual_guidance_text:
      'Ask: "Is there a standing platform governance board that meets at least monthly to review demand, roadmap, and major change?" Enter 1 for yes, 0 for no. Capture attendee roles and cadence in manual_response_notes.',
    target_value: 1,
    threshold_red: 0,
    threshold_amber: 0,
    higher_is_better: true,
    weight_in_category: 0.4,
    unit: 'bool',
    active: true,
    default_likely_cause:
      'No standing governance forum means demand, change, and roadmap decisions happen ad-hoc, causing conflicting priorities and unsanctioned customizations.',
    default_suggested_action:
      'Stand up a monthly platform governance board with Process Owner, Platform Owner, Security, and a business sponsor. Charter: demand intake, roadmap, major change approval, and OOTB-deviation reviews.',
    default_owner_role: 'platform_owner',
    default_effort_tshirt: 'm',
    default_quick_win_flag: false,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_manual_upgrade_cadence'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_governance_manual'),
    name: 'manual_upgrade_cadence',
    label: 'Upgrade cadence maturity',
    description:
      'How predictable and timely is the N-1 upgrade cadence? 0=never upgraded, 1=>12mo drift, 2=on N-1 but reactive, 3=scheduled with regression plan.',
    collector_type: 'manual',
    manual_guidance_text:
      'Score 0–3 based on: are upgrades planned on a calendar, is there a regression test plan, is the instance within N-1 of latest family? Capture last upgrade date and family in manual_response_notes.',
    target_value: 3,
    threshold_red: 0,
    threshold_amber: 2,
    higher_is_better: true,
    weight_in_category: 0.3,
    unit: 'score',
    active: true,
    default_likely_cause:
      'Drifted upgrade cadence accumulates security patches skipped, OOTB improvements missed, and builds up regression debt that makes eventual upgrade high-risk.',
    default_suggested_action:
      'Commit to N-1 cadence: lock upgrade dates at the start of each ServiceNow family, build an automated regression pack, and publish the schedule in the governance board.',
    default_owner_role: 'platform_owner',
    default_effort_tshirt: 'l',
    default_quick_win_flag: false,
  },
})

Record({
  $id: Now.ID['maf_plathealth_m_manual_non_prod_refresh'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_plathealth_cat'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_plathealth_sub_governance_manual'),
    name: 'manual_non_prod_refresh_discipline',
    label: 'Non-prod refresh discipline',
    description:
      'Is there a documented, masked non-prod refresh schedule? 0=no schedule, 1=ad-hoc, 2=scheduled but no masking, 3=scheduled with masking and clone exclusions.',
    collector_type: 'manual',
    manual_guidance_text:
      'Score 0–3 based on: clone frequency, masking of PII/PHI, exclusion sets applied, and sub-prod smoke tests after clone. Note the last clone date in manual_response_notes.',
    target_value: 3,
    threshold_red: 0,
    threshold_amber: 2,
    higher_is_better: true,
    weight_in_category: 0.3,
    unit: 'score',
    active: true,
    default_likely_cause:
      'Uncontrolled non-prod refreshes either leak production PII into sub-prod, or leave sub-prod so stale that release testing happens against unrepresentative data.',
    default_suggested_action:
      'Document a quarterly clone schedule with a data-masking exclusion set, a smoke-test runbook, and a named clone owner. Log every clone in the governance board minutes.',
    default_owner_role: 'admin',
    default_effort_tshirt: 'm',
    default_quick_win_flag: true,
  },
})
