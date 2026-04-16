import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

/** PRD §4.2 — mttr_hours_30d migrated to MAFDurationCollector (must match ITSMMTTRCollector ±0.01h). */
const SCRIPT_PARAMS_MTTR_HOURS_30D = JSON.stringify({
  table: 'incident',
  start_field: 'opened_at',
  end_field: 'resolved_at',
  filter: 'stateIN6,7',
  window_field: 'resolved_at',
  window_days: 30,
  unit: 'hours',
  aggregation: 'avg',
})

/** PRD §4.3 — reopen_rate_30d migrated to MAFWindowedRatioCollector. */
const SCRIPT_PARAMS_REOPEN_30D = JSON.stringify({
  table: 'incident',
  numerator_filter: 'stateIN6,7^reopen_count>0',
  denominator_filter: 'stateIN6,7',
  window_field: 'resolved_at',
  window_days: 30,
  empty_denominator_value: 0,
})

/**
 * ITSM content pack (PRD §5–6) — shipped with the application via Fluent Record seed data.
 */
Record({
  $id: Now.ID['maf_seed_pack_itsm'],
  table: 'x_maf_core_pack',
  data: {
    name: 'itsm',
    label: 'IT Service Management',
    description: 'ITSM maturity metrics (MAF content pack v3).',
    version: '3.0.0',
    vendor: 'MAF Core',
    active: true,
    order: 100,
  },
})

Record({
  $id: Now.ID['maf_seed_cat_data_quality'],
  table: 'x_maf_core_category',
  data: {
    pack: Now.ref('x_maf_core_pack', 'maf_seed_pack_itsm'),
    name: 'data_quality',
    label: 'Data Quality',
    description: 'Incident field completeness and consistency.',
    weight: 0.2,
    order: 1,
  },
})

Record({
  $id: Now.ID['maf_seed_cat_operational'],
  table: 'x_maf_core_category',
  data: {
    pack: Now.ref('x_maf_core_pack', 'maf_seed_pack_itsm'),
    name: 'operational',
    label: 'Operational Performance',
    description: 'Throughput, time, and resolution quality.',
    weight: 0.25,
    order: 2,
  },
})

Record({
  $id: Now.ID['maf_seed_cat_process_adherence'],
  table: 'x_maf_core_category',
  data: {
    pack: Now.ref('x_maf_core_pack', 'maf_seed_pack_itsm'),
    name: 'process_adherence',
    label: 'Process Adherence',
    description: 'SLA, problem linkage, and resolution path.',
    weight: 0.2,
    order: 3,
  },
})

Record({
  $id: Now.ID['maf_seed_cat_platform_hygiene'],
  table: 'x_maf_core_category',
  data: {
    pack: Now.ref('x_maf_core_pack', 'maf_seed_pack_itsm'),
    name: 'platform_hygiene',
    label: 'Platform Hygiene',
    description:
      'Catalog surface, fulfillment mechanism, client-side choices, variables, taxonomy, customization debt, notification and SLA definition health.',
    weight: 0.2,
    order: 4,
  },
})

Record({
  $id: Now.ID['maf_seed_cat_automation_reuse'],
  table: 'x_maf_core_category',
  data: {
    pack: Now.ref('x_maf_core_pack', 'maf_seed_pack_itsm'),
    name: 'automation_reuse',
    label: 'Automation & Reuse',
    description: 'AWA adoption, assignment strategy, flow reuse, subflows, auto-assignment and auto-approval rates, assignment rule sanity.',
    weight: 0.15,
    order: 5,
  },
})

/**
 * ITSM sub-categories (PRD §4.4) — metric weights roll up within sub-category; sub-category
 * weights roll up within each `x_maf_core_category`. Tuned defaults (equal split where multiple
 * sub-categories exist under one category).
 *
 * Ops (§4.5): before first production deploy of this migration, archive each customer's latest
 * `x_maf_core_assessment_run` (or run a final baseline assessment) so pre-migration scores
 * are preserved for continuity comparison (expect ±5pt drift per category after tuning).
 */
Record({
  $id: Now.ID['maf_seed_sub_itsm_data_quality_fields'],
  table: 'x_maf_core_sub_category',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_data_quality'),
    name: 'itsm_data_quality_fields',
    label: 'Data quality — fields & KB',
    description:
      'Incident/change/problem/KB field completeness and CI linkage. Single sub-category under Data Quality; weight_in_category = 1.0.',
    weight_in_category: 1.0,
    order: 1,
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_sub_itsm_ops_time_resolution'],
  table: 'x_maf_core_sub_category',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_operational'),
    name: 'itsm_ops_time_resolution',
    label: 'Operational — time & resolution quality',
    description:
      'MTTR, reopen, FCR, fulfillment/approval cycle times, change lead time, major-incident MTTR. Paired with backlog/volume sub-category; weights 0.5 / 0.5.',
    weight_in_category: 0.5,
    order: 1,
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_sub_itsm_ops_backlog_volume'],
  table: 'x_maf_core_sub_category',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_operational'),
    name: 'itsm_ops_backlog_volume',
    label: 'Operational — backlog & change health',
    description:
      'Aged backlogs, change success/unauthorized rates, major-incident volume. Paired with time/resolution sub-category; weights 0.5 / 0.5.',
    weight_in_category: 0.5,
    order: 2,
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_sub_itsm_process_governance'],
  table: 'x_maf_core_sub_category',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_process_adherence'),
    name: 'itsm_process_governance',
    label: 'Process adherence — SLA, problem, change, MI',
    description:
      'Single sub-category under Process Adherence; weight_in_category = 1.0.',
    weight_in_category: 1.0,
    order: 1,
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_sub_itsm_ph_catalog_taxonomy'],
  table: 'x_maf_core_sub_category',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    name: 'itsm_ph_catalog_taxonomy',
    label: 'Platform hygiene — catalog & taxonomy',
    description:
      'Catalog content, usage, taxonomy; four-way split under Platform Hygiene; weight 0.25.',
    weight_in_category: 0.25,
    order: 1,
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_sub_itsm_ph_ux_variables'],
  table: 'x_maf_core_sub_category',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    name: 'itsm_ph_ux_variables',
    label: 'Platform hygiene — UX, client scripts, variables',
    description:
      'Catalog client/UI footprint and variable hygiene; four-way split; weight 0.25.',
    weight_in_category: 0.25,
    order: 2,
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_sub_itsm_ph_custom_code'],
  table: 'x_maf_core_sub_category',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    name: 'itsm_ph_custom_code',
    label: 'Platform hygiene — customization debt',
    description:
      'Custom BR/CS on ITSM tables and OOTB modification counts; four-way split; weight 0.25.',
    weight_in_category: 0.25,
    order: 3,
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_sub_itsm_ph_notifications_sla'],
  table: 'x_maf_core_sub_category',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    name: 'itsm_ph_notifications_sla',
    label: 'Platform hygiene — notifications & SLA definitions',
    description:
      'sysevent_email_action and contract_sla definition health; four-way split; weight 0.25.',
    weight_in_category: 0.25,
    order: 4,
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_sub_itsm_automation_reuse'],
  table: 'x_maf_core_sub_category',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_automation_reuse'),
    name: 'itsm_automation_reuse',
    label: 'Automation & reuse',
    description:
      'Flow/catalog automation, AWA, assignment rules, data lookups. Single sub-category; weight_in_category = 1.0.',
    weight_in_category: 1.0,
    order: 1,
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_m1_category_populated'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_data_quality'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_data_quality_fields'),
    name: 'incident_category_populated',
    label: 'Incident category populated',
    description:
      'Percentage of active incidents with the Category field populated for consistent reporting and analytics.',
    collector_type: 'declarative',
    source_table: 'incident',
    filter_condition: 'active=true^categoryISNOTEMPTY',
    aggregation: 'percentage',
    denominator_filter: 'active=true',
    target_value: 98,
    threshold_red: 70,
    threshold_amber: 85,
    higher_is_better: true,
    weight_in_category: 0.13,
    unit: '%',
    active: true,
    default_likely_cause:
      'Category is not mandatory on incident, or the available categories do not match how agents actually triage. Templates and portal producers may bypass the field entirely.',
    default_suggested_action:
      'Review the incident category taxonomy with the service desk leads, make Category mandatory at Assignment state via data policy or UI policy, and backfill historical incidents via targeted fix scripts so reporting becomes trustworthy.',
    default_owner_role: 'process_owner',
    default_effort_tshirt: 's',
    default_quick_win_flag: true,
  },
})

Record({
  $id: Now.ID['maf_seed_m2_ci_linked'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_data_quality'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_data_quality_fields'),
    name: 'incident_ci_linked',
    label: 'Incident CI linked',
    description:
      'Percentage of active incidents with a configuration item (`cmdb_ci`) linked. Higher linkage improves impact analysis and CMDB-driven routing. Denominator: active incidents; numerator: active incidents with CI populated.',
    collector_type: 'declarative',
    source_table: 'incident',
    filter_condition: 'active=true^cmdb_ciISNOTEMPTY',
    aggregation: 'percentage',
    denominator_filter: 'active=true',
    target_value: 90,
    threshold_red: 50,
    threshold_amber: 75,
    higher_is_better: true,
    weight_in_category: 0.12,
    unit: '%',
    active: true,
    default_likely_cause:
      'CMDB coverage is thin for the services that incidents are raised against, or the CI lookup on the incident form is slow/unusable so agents skip it. Event-generated incidents may land with blank CI when the integration cannot resolve one.',
    default_suggested_action:
      'Review CI class coverage for the top 10 affected services, wire the incident form to default CI from caller/affected service, and tighten event integrations to enforce CI resolution before creating an incident.',
    default_owner_role: 'data_steward',
    default_effort_tshirt: 'm',
    default_quick_win_flag: false,
  },
})

Record({
  $id: Now.ID['maf_seed_m3_short_desc_len'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_data_quality'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_data_quality_fields'),
    name: 'incident_short_description_length',
    label: 'Short description length at least 20',
    description:
      'Uses LIKE pattern of 20 underscores (PRD §10). Adjust if instance encoding differs.',
    collector_type: 'declarative',
    source_table: 'incident',
    filter_condition:
      'active=true^short_descriptionISNOTEMPTY^short_descriptionLIKE____________________',
    aggregation: 'percentage',
    denominator_filter: 'active=true',
    target_value: 95,
    threshold_red: 60,
    threshold_amber: 80,
    higher_is_better: true,
    weight_in_category: 0.08,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_m4_assignment_group_resolve'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_data_quality'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_data_quality_fields'),
    name: 'assignment_group_at_resolve',
    label: 'Assignment group set at resolve',
    description:
      'Percentage of resolved or closed incidents with an assignment group set, validating ownership at closure. OOTB: stateIN6,7 includes resolved and closed.',
    collector_type: 'declarative',
    source_table: 'incident',
    filter_condition: 'stateIN6,7^assignment_groupISNOTEMPTY',
    aggregation: 'percentage',
    denominator_filter: 'stateIN6,7',
    target_value: 99,
    threshold_red: 85,
    threshold_amber: 95,
    higher_is_better: true,
    weight_in_category: 0.13,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_m5_reopen_rate'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_operational'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ops_time_resolution'),
    name: 'reopen_rate_30d',
    label: 'Reopen rate (last 30 days)',
    collector_type: 'script_include',
    script_include: 'MAFWindowedRatioCollector',
    script_params: SCRIPT_PARAMS_REOPEN_30D,
    target_value: 2,
    threshold_red: 15,
    threshold_amber: 7,
    higher_is_better: false,
    weight_in_category: 0.08,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_m6_mttr'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_operational'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ops_time_resolution'),
    name: 'mttr_hours_30d',
    label: 'Mean time to resolve (hours)',
    collector_type: 'script_include',
    script_include: 'MAFDurationCollector',
    script_params: SCRIPT_PARAMS_MTTR_HOURS_30D,
    target_value: 8,
    threshold_red: 48,
    threshold_amber: 24,
    higher_is_better: false,
    weight_in_category: 0.13,
    unit: 'hours',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_m7_fcr'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_operational'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ops_time_resolution'),
    name: 'first_call_resolution_rate',
    label: 'First call resolution rate',
    description:
      'FCR proxy: resolver is the fulfiller who opened the ticket (resolved_bySAMEASopened_by). stateIN6,7 = Resolved or Closed. If integrations create rows, sys_created_by may differ from opened_by — adjust per instance.',
    collector_type: 'declarative',
    source_table: 'incident',
    filter_condition: 'stateIN6,7^resolved_bySAMEASopened_by',
    aggregation: 'percentage',
    denominator_filter: 'stateIN6,7',
    target_value: 65,
    threshold_red: 25,
    threshold_amber: 45,
    higher_is_better: true,
    weight_in_category: 0.075,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_m8_sla'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_process_adherence'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_process_governance'),
    name: 'sla_attainment_incident',
    label: 'SLA attainment (incident task SLAs)',
    collector_type: 'declarative',
    source_table: 'task_sla',
    filter_condition: 'has_breached=false^task.sys_class_name=incident',
    aggregation: 'percentage',
    denominator_filter: 'task.sys_class_name=incident',
    target_value: 98,
    threshold_red: 80,
    threshold_amber: 90,
    higher_is_better: true,
    weight_in_category: 0.135,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_m9_recurring_problem'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_process_adherence'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_process_governance'),
    name: 'recurring_incidents_problem_link',
    label: 'Recurring incidents linked to problem',
    collector_type: 'script_include',
    script_include: 'ITSMRecurringProblemLinkCollector',
    script_params: '{"window_days":90}',
    target_value: 80,
    threshold_red: 30,
    threshold_amber: 55,
    higher_is_better: true,
    weight_in_category: 0.045,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_m10_kb_close_proxy'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_process_adherence'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_process_governance'),
    name: 'resolved_kb_style_close_codes',
    label: 'Incidents resolved with KB-style close codes',
    description:
      'Retired (ITSM pack v2): superseded by incident_kb_attached_at_resolve (K3). Row kept inactive for audit trail.',
    collector_type: 'declarative',
    source_table: 'incident',
    filter_condition:
      'stateIN6,7^close_code=Solved (Work Around)^NQstateIN6,7^close_code=Solved Permanently',
    aggregation: 'percentage',
    denominator_filter: 'stateIN6,7',
    target_value: 60,
    threshold_red: 15,
    threshold_amber: 35,
    higher_is_better: true,
    weight_in_category: 0,
    unit: '%',
    active: false,
  },
})

Record({
  $id: Now.ID['maf_seed_i1_major_incident_mttr'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_operational'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ops_time_resolution'),
    name: 'major_incident_mttr_hours',
    label: 'Major incident MTTR (hours)',
    description:
      'Merged v2 major_incident_mttr_hours_30d with PRD §7.1 MI2: 90-day window, closed incidents with major_incident_state set. After merge, all Operational Performance weights are scaled by 100/92 so the category still sums to 1.0 (§9.2).',
    collector_type: 'script_include',
    script_include: 'MAFDurationCollector',
    script_params: JSON.stringify({
      table: 'incident',
      start_field: 'opened_at',
      end_field: 'resolved_at',
      filter: 'stateIN6,7^major_incident_state!=',
      window_field: 'resolved_at',
      window_days: 90,
      unit: 'hours',
      aggregation: 'avg',
    }),
    target_value: 2,
    threshold_red: 12,
    threshold_amber: 6,
    higher_is_better: false,
    weight_in_category: 0.075,
    unit: 'hours',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_i2_incident_backlog_aged'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_operational'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ops_backlog_volume'),
    name: 'incident_backlog_aged_30d',
    label: 'Open incidents older than 30 days (%)',
    collector_type: 'declarative',
    source_table: 'incident',
    filter_condition: 'active=true^opened_at<javascript:gs.daysAgoStart(30)',
    aggregation: 'percentage',
    denominator_filter: 'active=true',
    target_value: 2,
    threshold_red: 25,
    threshold_amber: 10,
    higher_is_better: false,
    weight_in_category: 0.05,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_i3_incident_reassignment_low'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_process_adherence'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_process_governance'),
    name: 'incident_reassignment_low',
    label: 'Incidents resolved with ≤1 reassignment (%)',
    description:
      'Uses incident.reassignment_count (OOTB). If absent on the instance, the collector returns null with an error.',
    collector_type: 'declarative',
    source_table: 'incident',
    filter_condition: 'stateIN6,7^reassignment_count<=1',
    aggregation: 'percentage',
    denominator_filter: 'stateIN6,7',
    target_value: 85,
    threshold_red: 50,
    threshold_amber: 70,
    higher_is_better: true,
    weight_in_category: 0.072,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_p1_problem_root_cause'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_process_adherence'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_process_governance'),
    name: 'problem_root_cause_identified',
    label: 'Problems with root cause documented (%)',
    description:
      'OOTB: cause text on problem.cause_notes. Denominator = problems in Resolved (106) or Closed (107). Numerator = same states with cause_notes populated. OOTB state map: 101 New, 102 Assess, 103 Root Cause Analysis, 104 Fix in Progress, 106 Resolved, 107 Closed.',
    collector_type: 'declarative',
    source_table: 'problem',
    filter_condition: 'stateIN106,107^cause_notesISNOTEMPTY',
    aggregation: 'percentage',
    denominator_filter: 'stateIN106,107',
    target_value: 85,
    threshold_red: 40,
    threshold_amber: 65,
    higher_is_better: true,
    weight_in_category: 0.108,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_p2_problem_known_error_rate'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_process_adherence'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_process_governance'),
    name: 'problem_known_error_rate',
    label: 'Problems flagged as known errors (%)',
    description:
      'OOTB boolean problem.known_error. Numerator and denominator both scope to active (open) problems so the ratio is valid. Replaces legacy stateNOTIN1,2 (classic task states), which does not match OOTB Problem state values 101–107.',
    collector_type: 'declarative',
    source_table: 'problem',
    filter_condition: 'active=true^known_error=true',
    aggregation: 'percentage',
    denominator_filter: 'active=true',
    target_value: 60,
    threshold_red: 20,
    threshold_amber: 40,
    higher_is_better: true,
    weight_in_category: 0.045,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_p3_problem_backlog_aged_90d'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_operational'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ops_backlog_volume'),
    name: 'problem_backlog_aged_90d',
    label: 'Open problems older than 90 days (%)',
    description:
      'OOTB: task.opened_at on problem. Share of active problems whose opened_at is older than 90 days (stale backlog).',
    collector_type: 'declarative',
    source_table: 'problem',
    filter_condition: 'active=true^opened_at<javascript:gs.daysAgoStart(90)',
    aggregation: 'percentage',
    denominator_filter: 'active=true',
    target_value: 5,
    threshold_red: 40,
    threshold_amber: 20,
    higher_is_better: false,
    weight_in_category: 0.05,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_c1_change_success_rate'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_operational'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ops_backlog_volume'),
    name: 'change_success_rate',
    label: 'Change success rate (%)',
    description:
      'Percentage of closed changes with close code “successful.” Reflects change execution quality.',
    collector_type: 'declarative',
    source_table: 'change_request',
    filter_condition: 'state=3^close_code=successful',
    aggregation: 'percentage',
    denominator_filter: 'state=3',
    target_value: 95,
    threshold_red: 70,
    threshold_amber: 85,
    higher_is_better: true,
    weight_in_category: 0.16,
    unit: '%',
    active: true,
    default_likely_cause:
      'Close codes are used loosely: "successful" is selected by default even when the change backed out, rolled forward with defects, or hit post-implementation issues. Alternatively, weak technical reviews are letting risky changes through.',
    default_suggested_action:
      'Require a close-code reason on unsuccessful closures, audit the last 90 days of closed changes for miscoded outcomes, and strengthen the CAB/peer-review gate for normal changes with high-risk CIs.',
    default_owner_role: 'process_owner',
    default_effort_tshirt: 'm',
    default_quick_win_flag: false,
  },
})

Record({
  $id: Now.ID['maf_seed_c2_change_emergency_ratio'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_process_adherence'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_process_governance'),
    name: 'change_emergency_ratio',
    label: 'Emergency change ratio (%)',
    description:
      'Percentage of closed changes (`state=3`) that were logged as emergency type. Lower is usually better; high ratios may indicate bypassing standard change governance. Denominator: closed changes; numerator: emergency-type closed changes.',
    collector_type: 'declarative',
    source_table: 'change_request',
    filter_condition: 'type=emergency',
    aggregation: 'percentage',
    denominator_filter: 'state=3',
    target_value: 5,
    threshold_red: 25,
    threshold_amber: 12,
    higher_is_better: false,
    weight_in_category: 0.072,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_c3_change_unauthorized_rate'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_operational'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ops_backlog_volume'),
    name: 'change_unauthorized_rate',
    label: 'Unauthorized / unsuccessful change rate (%)',
    collector_type: 'declarative',
    source_table: 'change_request',
    filter_condition: 'state=3^close_codeINunsuccessful,unauthorized',
    aggregation: 'percentage',
    denominator_filter: 'state=3',
    target_value: 2,
    threshold_red: 20,
    threshold_amber: 8,
    higher_is_better: false,
    weight_in_category: 0.05,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_c4_change_lead_time_normal'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_operational'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ops_time_resolution'),
    name: 'change_lead_time_hours_normal',
    label: 'Normal change lead time — requested to scheduled (hours)',
    collector_type: 'script_include',
    script_include: 'MAFDurationCollector',
    script_params: JSON.stringify({
      table: 'change_request',
      start_field: 'requested_by_date',
      end_field: 'start_date',
      filter: 'type=normal',
      window_field: 'start_date',
      window_days: 90,
      unit: 'hours',
      aggregation: 'avg',
    }),
    target_value: 48,
    threshold_red: 240,
    threshold_amber: 120,
    higher_is_better: false,
    weight_in_category: 0.05,
    unit: 'hours',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_c5_change_backout_completed'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_data_quality'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_data_quality_fields'),
    name: 'change_backout_completed',
    label: 'Changes with backout plan documented (%)',
    description:
      'Percentage of active changes that have a non-empty backout plan documented. Measures operational readiness for rollback before implementation. Denominator: all active changes; numerator: active changes with `backout_plan` populated.',
    collector_type: 'declarative',
    source_table: 'change_request',
    filter_condition: 'active=true^backout_planISNOTEMPTY',
    aggregation: 'percentage',
    denominator_filter: 'active=true',
    target_value: 95,
    threshold_red: 60,
    threshold_amber: 80,
    higher_is_better: true,
    weight_in_category: 0.08,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_c6_change_cab_approved'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_process_adherence'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_process_governance'),
    name: 'change_cab_required_approved',
    label: 'Normal changes with CAB approval recorded (%)',
    description:
      'Percentage of closed normal changes with CAB approval recorded, for governance adherence.',
    collector_type: 'declarative',
    source_table: 'change_request',
    filter_condition: 'type=normal^state=3^approval=approved',
    aggregation: 'percentage',
    denominator_filter: 'type=normal^state=3',
    target_value: 98,
    threshold_red: 75,
    threshold_amber: 90,
    higher_is_better: true,
    weight_in_category: 0.072,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_r1_sla_attainment_ritm'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_process_adherence'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_process_governance'),
    name: 'sla_attainment_ritm',
    label: 'SLA attainment (RITM task SLAs)',
    description:
      'Percentage of RITM task SLAs that have not breached (`has_breached=false`), measuring request fulfillment timeliness.',
    collector_type: 'declarative',
    source_table: 'task_sla',
    filter_condition: 'has_breached=false^task.sys_class_name=sc_req_item',
    aggregation: 'percentage',
    denominator_filter: 'task.sys_class_name=sc_req_item',
    target_value: 97,
    threshold_red: 75,
    threshold_amber: 88,
    higher_is_better: true,
    weight_in_category: 0.135,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_r2_ritm_fulfillment_hours'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_operational'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ops_time_resolution'),
    name: 'ritm_fulfillment_time_hours_30d',
    label: 'RITM fulfillment time (hours)',
    collector_type: 'script_include',
    script_include: 'MAFDurationCollector',
    script_params: JSON.stringify({
      table: 'sc_req_item',
      start_field: 'opened_at',
      end_field: 'closed_at',
      filter: 'state=3',
      window_field: 'closed_at',
      window_days: 30,
      unit: 'hours',
      aggregation: 'avg',
    }),
    target_value: 24,
    threshold_red: 168,
    threshold_amber: 72,
    higher_is_better: false,
    weight_in_category: 0.075,
    unit: 'hours',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_r3_ritm_approval_cycle_time'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_operational'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ops_time_resolution'),
    name: 'ritm_approval_cycle_time_hours',
    label: 'RITM approval cycle time (hours)',
    description:
      'Proxy using sysapproval_approver.sys_created_on → sys_updated_on for approvals tied to sc_req_item (PRD §8). A more accurate measure would require audit history.',
    collector_type: 'script_include',
    script_include: 'MAFDurationCollector',
    script_params: JSON.stringify({
      table: 'sysapproval_approver',
      start_field: 'sys_created_on',
      end_field: 'sys_updated_on',
      filter: 'stateINapproved,rejected^source_table=sc_req_item',
      window_field: 'sys_updated_on',
      window_days: 30,
      unit: 'hours',
      aggregation: 'avg',
    }),
    target_value: 8,
    threshold_red: 72,
    threshold_amber: 24,
    higher_is_better: false,
    weight_in_category: 0.05,
    unit: 'hours',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_k1_kb_article_freshness'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_data_quality'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_data_quality_fields'),
    name: 'kb_article_freshness',
    label: 'KB articles reviewed in last 12 months (%)',
    description:
      'Percentage of published knowledge articles updated or reviewed within the last 12 months (`sys_updated_on`). Stale articles reduce trust in self-service and search.',
    collector_type: 'declarative',
    source_table: 'kb_knowledge',
    filter_condition:
      'workflow_state=published^sys_updated_on>=javascript:gs.monthsAgoStart(12)',
    aggregation: 'percentage',
    denominator_filter: 'workflow_state=published',
    target_value: 80,
    threshold_red: 35,
    threshold_amber: 60,
    higher_is_better: true,
    weight_in_category: 0.09,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_k2_kb_orphaned_articles'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_data_quality'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_data_quality_fields'),
    name: 'kb_article_active_readership_90d',
    label: 'Published KB articles viewed in last 90 days (%)',
    description:
      'Uses kb_use table to track actual article consumption. Counts distinct articles with at least one view event (kb_use row) in the last 90 days as a share of all published articles. Replaces legacy use_count=0 check which only captured lifetime totals.',
    collector_type: 'script_include',
    script_include: 'MAFCrossTableRatioCollector',
    script_params: JSON.stringify({
      numerator_table: 'kb_use',
      numerator_filter: 'sys_created_on>=javascript:gs.daysAgoStart(90)',
      numerator_distinct_field: 'article',
      denominator_table: 'kb_knowledge',
      denominator_filter: 'workflow_state=published',
      empty_denominator_value: 0,
    }),
    target_value: 95,
    threshold_red: 70,
    threshold_amber: 85,
    higher_is_better: true,
    weight_in_category: 0.04,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_k3_incident_kb_attached'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_process_adherence'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_process_governance'),
    name: 'incident_kb_attached_at_resolve',
    label: 'Resolved incidents with KB article linked (%)',
    description:
      'Uses incident.kb_knowledge when the Knowledge Management field is present (may not appear in thin XML exports). stateIN6,7 = Resolved or Closed. If KB is linked via another table or field, adjust the filter per instance.',
    collector_type: 'declarative',
    source_table: 'incident',
    filter_condition: 'stateIN6,7^kb_knowledgeISNOTEMPTY',
    aggregation: 'percentage',
    denominator_filter: 'stateIN6,7',
    target_value: 50,
    threshold_red: 15,
    threshold_amber: 30,
    higher_is_better: true,
    weight_in_category: 0.036,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_cmdb1_problem_ci_linked'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_data_quality'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_data_quality_fields'),
    name: 'problem_ci_linked',
    label: 'Problems with CI linked (%)',
    description:
      'OOTB problem.cmdb_ci reference. Share of active problems with a configuration item linked.',
    collector_type: 'declarative',
    source_table: 'problem',
    filter_condition: 'active=true^cmdb_ciISNOTEMPTY',
    aggregation: 'percentage',
    denominator_filter: 'active=true',
    target_value: 85,
    threshold_red: 30,
    threshold_amber: 60,
    higher_is_better: true,
    weight_in_category: 0.06,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_cmdb2_change_ci_linked'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_data_quality'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_data_quality_fields'),
    name: 'change_ci_linked',
    label: 'Changes with CI linked (%)',
    collector_type: 'declarative',
    source_table: 'change_request',
    filter_condition: 'active=true^cmdb_ciISNOTEMPTY',
    aggregation: 'percentage',
    denominator_filter: 'active=true',
    target_value: 90,
    threshold_red: 40,
    threshold_amber: 70,
    higher_is_better: true,
    weight_in_category: 0.07,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_cmdb3_incident_business_service_linked'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_data_quality'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_data_quality_fields'),
    name: 'incident_business_service_linked',
    label: 'Incidents with business service set (%)',
    collector_type: 'declarative',
    source_table: 'incident',
    filter_condition: 'active=true^business_serviceISNOTEMPTY',
    aggregation: 'percentage',
    denominator_filter: 'active=true',
    target_value: 80,
    threshold_red: 25,
    threshold_amber: 55,
    higher_is_better: true,
    weight_in_category: 0.04,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_mi1_major_incident_ratio'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_process_adherence'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_process_governance'),
    name: 'major_incident_ratio',
    label: 'P1 incidents promoted to major incident (%)',
    description:
      'Uses major_incident_state!= (empty) as “promoted”; enum values vary by instance (PRD §7.1).',
    collector_type: 'declarative',
    source_table: 'incident',
    filter_condition: 'priority=1^major_incident_state!=',
    aggregation: 'percentage',
    denominator_filter: 'priority=1',
    target_value: 60,
    threshold_red: 15,
    threshold_amber: 35,
    higher_is_better: true,
    weight_in_category: 0.09,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_mi3_major_incident_comms'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_process_adherence'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_process_governance'),
    name: 'major_incident_work_notes',
    label: 'Major incidents with work notes (%)',
    description:
      'Share of promoted major incidents (major_incident_state set) with incident.work_notes populated. Separate from major_incident_communication_plan, which uses MIM incident_alert.comm_plan_definition.',
    collector_type: 'declarative',
    source_table: 'incident',
    filter_condition: 'major_incident_state!=^work_notesISNOTEMPTY',
    aggregation: 'percentage',
    denominator_filter: 'major_incident_state!=',
    target_value: 95,
    threshold_red: 50,
    threshold_amber: 75,
    higher_is_better: true,
    weight_in_category: 0.045,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_mi5_major_incident_comm_plan'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_process_adherence'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_process_governance'),
    name: 'major_incident_communication_plan',
    label: 'Major incidents with communication plan (%)',
    description:
      'MIM incident_alert (ICP): distinct source_incident with comm_plan_definition set, over promoted incidents. Requires Major Incident Management; numerator uses incident_alert.source_incident dot-walk to incident.major_incident_state. incident_alert_task is not used — tasks hang off the ICP record.',
    collector_type: 'script_include',
    script_include: 'MAFCrossTableRatioCollector',
    script_params: JSON.stringify({
      numerator_table: 'incident_alert',
      numerator_filter: 'source_incident.major_incident_state!=^comm_plan_definitionISNOTEMPTY',
      numerator_distinct_field: 'source_incident',
      denominator_table: 'incident',
      denominator_filter: 'major_incident_state!=',
      empty_denominator_value: 0,
    }),
    target_value: 95,
    threshold_red: 50,
    threshold_amber: 75,
    higher_is_better: true,
    weight_in_category: 0.045,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_change_pir_completion_rate'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_process_adherence'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_process_governance'),
    name: 'change_pir_completion_rate',
    label: 'Change PIR documentation (proxy) (%)',
    description:
      'Share of closed changes with close_notes populated as a lightweight post-implementation documentation proxy. Replace filters with your PIR field (e.g. lessons_learned, review fields) if used on the instance.',
    collector_type: 'declarative',
    source_table: 'change_request',
    filter_condition: 'state=3^close_notesISNOTEMPTY',
    aggregation: 'percentage',
    denominator_filter: 'state=3',
    target_value: 90,
    threshold_red: 40,
    threshold_amber: 65,
    higher_is_better: true,
    weight_in_category: 0.025,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_change_rollback_rate'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_process_adherence'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_process_governance'),
    name: 'change_rollback_rate',
    label: 'Changes with backout executed (%)',
    description:
      'Share of closed changes where change_request.backout indicates execution (encoded query uses backout=success). Verify internal choice values on your instance (e.g. successful, complete) and adjust the filter.',
    collector_type: 'declarative',
    source_table: 'change_request',
    filter_condition: 'state=3^backout=success',
    aggregation: 'percentage',
    denominator_filter: 'state=3',
    target_value: 5,
    threshold_red: 25,
    threshold_amber: 12,
    higher_is_better: false,
    weight_in_category: 0.025,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_change_schedule_adherence'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_process_adherence'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_process_governance'),
    name: 'change_schedule_adherence',
    label: 'Change schedule adherence (%)',
    description:
      'Closed changes where work_start is within tolerance_hours of planned start_date. Default tolerance 24h; override via script_params.',
    collector_type: 'script_include',
    script_include: 'MAFChangeScheduleAdherenceCollector',
    script_params: JSON.stringify({ tolerance_hours: 24 }),
    target_value: 85,
    threshold_red: 50,
    threshold_amber: 68,
    higher_is_better: true,
    weight_in_category: 0.05,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_mi4_major_incident_rate'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_operational'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ops_backlog_volume'),
    name: 'major_incident_rate',
    label: 'Major incident count (last 90 days)',
    description:
      'Raw count of major incidents promoted in the last 90 days (volume signal; interpret with process maturity). PRD §7.1 MI4.',
    collector_type: 'declarative',
    source_table: 'incident',
    filter_condition:
      'major_incident_state!=^sys_created_on>=javascript:gs.monthsAgoStart(3)',
    aggregation: 'count',
    target_value: 10,
    threshold_red: 40,
    threshold_amber: 20,
    higher_is_better: false,
    weight_in_category: 0.075,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ph_cat1_catalog_item_count'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_catalog_taxonomy'),
    name: 'catalog_item_count',
    label: 'Active catalog item count (raw)',
    description:
      'Counts active sc_cat_item rows whose sc_catalogs include a catalog linked to the default sp_portal (m2m_sp_portal_catalog or sp_portal.sc_catalog).',
    collector_type: 'script_include',
    script_include: 'MAFPortalMetricsCollector',
    script_params: JSON.stringify({ mode: 'sc_cat_item_count' }),
    target_value: 0,
    threshold_red: 0,
    threshold_amber: 0,
    higher_is_better: true,
    weight_in_category: 0,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ph_cat2_description_populated'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_catalog_taxonomy'),
    name: 'catalog_item_description_populated',
    label: 'Catalog items with description (%)',
    description:
      'Portal catalogs only: default sp_portal → m2m_sp_portal_catalog / sc_catalog on portal.',
    collector_type: 'script_include',
    script_include: 'MAFPortalMetricsCollector',
    script_params: JSON.stringify({
      mode: 'sc_cat_item_percentage',
      numerator_suffix: 'active=true^descriptionISNOTEMPTY',
      denominator_suffix: 'active=true',
    }),
    target_value: 95,
    threshold_red: 60,
    threshold_amber: 80,
    higher_is_better: true,
    weight_in_category: 0.054857142857142854,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ph_cat3_picture_populated'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_catalog_taxonomy'),
    name: 'catalog_item_picture_populated',
    label: 'Catalog items with picture set (%)',
    description: 'Portal-scoped via default sp_portal catalogs (see catalog_item_description_populated).',
    collector_type: 'script_include',
    script_include: 'MAFPortalMetricsCollector',
    script_params: JSON.stringify({
      mode: 'sc_cat_item_percentage',
      numerator_suffix: 'active=true^pictureISNOTEMPTY',
      denominator_suffix: 'active=true',
    }),
    target_value: 80,
    threshold_red: 25,
    threshold_amber: 50,
    higher_is_better: true,
    weight_in_category: 0.027428571428571427,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ph_cat4_short_description_quality'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_catalog_taxonomy'),
    name: 'catalog_item_short_description_quality',
    label: 'Catalog items with short description ≥ 20 chars (%)',
    description: 'Portal-scoped; 20 underscores = min length (PRD §10).',
    collector_type: 'script_include',
    script_include: 'MAFPortalMetricsCollector',
    script_params: JSON.stringify({
      mode: 'sc_cat_item_percentage',
      numerator_suffix:
        'active=true^short_descriptionISNOTEMPTY^short_descriptionLIKE____________________',
      denominator_suffix: 'active=true',
    }),
    target_value: 95,
    threshold_red: 60,
    threshold_amber: 80,
    higher_is_better: true,
    weight_in_category: 0.04571428571428571,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ph_cat5_category_populated'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_catalog_taxonomy'),
    name: 'catalog_item_category_populated',
    label: 'Catalog items with category set (%)',
    description:
      'sc_category is tied to sc_catalog; portal scope limits items to portal-linked catalogs.',
    collector_type: 'script_include',
    script_include: 'MAFPortalMetricsCollector',
    script_params: JSON.stringify({
      mode: 'sc_cat_item_percentage',
      numerator_suffix: 'active=true^categoryISNOTEMPTY',
      denominator_suffix: 'active=true',
    }),
    target_value: 98,
    threshold_red: 60,
    threshold_amber: 85,
    higher_is_better: true,
    weight_in_category: 0.054857142857142854,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ph_cat6_recently_ordered_30d'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_catalog_taxonomy'),
    name: 'catalog_item_recently_ordered_30d',
    label: 'Active catalog items with a RITM in last 30 days (%)',
    description:
      'CAT6-alt (PRD §7.2): distinct cat_item on recent RITMs vs active items. portal_catalog_scope limits numerator and denominator to catalogs on the default sp_portal.',
    collector_type: 'script_include',
    script_include: 'MAFCrossTableRatioCollector',
    script_params: JSON.stringify({
      numerator_table: 'sc_req_item',
      numerator_filter: 'sys_created_on>=javascript:gs.daysAgoStart(30)',
      numerator_distinct_field: 'cat_item',
      denominator_table: 'sc_cat_item',
      denominator_filter: 'active=true',
      empty_denominator_value: 0,
      portal_catalog_scope: true,
    }),
    target_value: 70,
    threshold_red: 20,
    threshold_amber: 40,
    higher_is_better: true,
    weight_in_category: 0.04571428571428571,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ph_cat7_avg_variables'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_catalog_taxonomy'),
    name: 'catalog_item_avg_variables',
    label: 'Average variables per active catalog item',
    collector_type: 'script_include',
    script_include: 'MAFGroupedAverageCollector',
    script_params: JSON.stringify({
      child_table: 'item_option_new',
      parent_field: 'cat_item',
      parent_table: 'sc_cat_item',
      parent_filter: 'active=true',
      child_filter: 'active=true',
      aggregation: 'avg',
      include_zero_parents: true,
      portal_catalog_scope: true,
    }),
    target_value: 0,
    threshold_red: 0,
    threshold_amber: 0,
    higher_is_better: false,
    weight_in_category: 0,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ar_fm1_flow_designer_adoption'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_automation_reuse'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_automation_reuse'),
    name: 'catalog_flow_designer_adoption',
    label: 'Catalog items using Flow Designer vs any fulfillment (%)',
    description:
      'PRD §7.3 FM1. Denominator: portal-scoped items with legacy workflow OR Flow (^NQ). Numerator: Flow Designer. Limited to default sp_portal catalogs (sc_catalogs / m2m_sp_portal_catalog).',
    collector_type: 'script_include',
    script_include: 'MAFPortalMetricsCollector',
    script_params: JSON.stringify({ mode: 'catalog_flow_designer_adoption' }),
    target_value: 90,
    threshold_red: 30,
    threshold_amber: 60,
    higher_is_better: true,
    weight_in_category: 0.18,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ar_fm2_legacy_workflow_residual'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_automation_reuse'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_automation_reuse'),
    name: 'catalog_legacy_workflow_residual',
    label: 'Catalog items still using legacy workflow (%)',
    description: 'Portal default sp_portal catalogs only (m2m_sp_portal_catalog / sp_portal.sc_catalog).',
    collector_type: 'script_include',
    script_include: 'MAFPortalMetricsCollector',
    script_params: JSON.stringify({
      mode: 'sc_cat_item_percentage',
      numerator_suffix: 'active=true^workflowISNOTEMPTY',
      denominator_suffix: 'active=true',
    }),
    target_value: 5,
    threshold_red: 50,
    threshold_amber: 25,
    higher_is_better: false,
    weight_in_category: 0.14,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ar_fm3_no_fulfillment'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_automation_reuse'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_automation_reuse'),
    name: 'catalog_items_no_fulfillment',
    label: 'Active catalog items with no flow and no workflow (%)',
    description: 'Portal-scoped catalogs on default sp_portal.',
    collector_type: 'script_include',
    script_include: 'MAFPortalMetricsCollector',
    script_params: JSON.stringify({
      mode: 'sc_cat_item_percentage',
      numerator_suffix: 'active=true^workflowISEMPTY^flow_designer_flowISEMPTY',
      denominator_suffix: 'active=true',
    }),
    target_value: 5,
    threshold_red: 30,
    threshold_amber: 15,
    higher_is_better: false,
    weight_in_category: 0.1,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ar_fm4_flow_reuse_ratio'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_automation_reuse'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_automation_reuse'),
    name: 'catalog_flow_reuse_ratio',
    label: 'Distinct Flow Designer flows per 100 catalog items with a flow (%)',
    description:
      'Lower is better (reuse). Values are distinct_flow_count / items_with_flow × 100 (PRD §7.3 FM4).',
    collector_type: 'script_include',
    script_include: 'MAFCrossTableRatioCollector',
    script_params: JSON.stringify({
      numerator_table: 'sc_cat_item',
      numerator_filter: 'active=true^flow_designer_flowISNOTEMPTY',
      numerator_distinct_field: 'flow_designer_flow',
      denominator_table: 'sc_cat_item',
      denominator_filter: 'active=true^flow_designer_flowISNOTEMPTY',
      empty_denominator_value: 0,
      portal_catalog_scope: true,
    }),
    target_value: 30,
    threshold_red: 90,
    threshold_amber: 60,
    higher_is_better: false,
    weight_in_category: 0.15,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ar_fm5_subflow_usage'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_automation_reuse'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_automation_reuse'),
    name: 'catalog_subflow_usage',
    label: 'Flows that call at least one subflow (%)',
    description:
      'Verify sys_hub_action_instance fields on your instance (PRD §7.3 FM5).',
    collector_type: 'script_include',
    script_include: 'MAFCrossTableRatioCollector',
    script_params: JSON.stringify({
      numerator_table: 'sys_hub_action_instance',
      numerator_filter: 'action_typeLIKEsubflow',
      numerator_distinct_field: 'flow',
      denominator_table: 'sys_hub_flow',
      denominator_filter: 'active=true^typeISNOTEMPTY',
      empty_denominator_value: 0,
    }),
    target_value: 40,
    threshold_red: 5,
    threshold_amber: 20,
    higher_is_better: true,
    weight_in_category: 0.1,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ph_cli1_avg_client_scripts'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_ux_variables'),
    name: 'catalog_avg_client_scripts_per_item',
    label: 'Average catalog client scripts per active item',
    collector_type: 'script_include',
    script_include: 'MAFGroupedAverageCollector',
    script_params: JSON.stringify({
      child_table: 'catalog_script_client',
      parent_field: 'cat_item',
      parent_table: 'sc_cat_item',
      parent_filter: 'active=true',
      child_filter: 'active=true',
      aggregation: 'avg',
      include_zero_parents: true,
      portal_catalog_scope: true,
    }),
    target_value: 0,
    threshold_red: 0,
    threshold_amber: 0,
    higher_is_better: false,
    weight_in_category: 0,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ph_cli2_avg_ui_policies'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_ux_variables'),
    name: 'catalog_avg_ui_policies_per_item',
    label: 'Average catalog UI policies per active item',
    collector_type: 'script_include',
    script_include: 'MAFGroupedAverageCollector',
    script_params: JSON.stringify({
      child_table: 'catalog_ui_policy',
      parent_field: 'catalog_item',
      parent_table: 'sc_cat_item',
      parent_filter: 'active=true',
      child_filter: 'active=true',
      aggregation: 'avg',
      include_zero_parents: true,
      portal_catalog_scope: true,
    }),
    target_value: 0,
    threshold_red: 0,
    threshold_amber: 0,
    higher_is_better: false,
    weight_in_category: 0,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ph_cli3_ui_vs_client_ratio'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_ux_variables'),
    name: 'catalog_ui_policy_vs_client_script_ratio',
    label: 'UI policies per 100 catalog client scripts',
    description:
      'Ratio (PRD §7.4 CLI3). Numerator/denominator scoped to catalog items in default portal catalogs via catalog_item / cat_item → sc_catalogs.',
    collector_type: 'script_include',
    script_include: 'MAFCrossTableRatioCollector',
    script_params: JSON.stringify({
      numerator_table: 'catalog_ui_policy',
      numerator_filter: 'active=true^catalog_item.active=true',
      denominator_table: 'catalog_script_client',
      denominator_filter: 'active=true^cat_item.active=true',
      empty_denominator_value: 0,
      portal_catalog_scope: true,
    }),
    target_value: 150,
    threshold_red: 40,
    threshold_amber: 80,
    higher_is_better: true,
    weight_in_category: 0.07314285714285713,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ph_cli4_incident_client_scripts'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_ux_variables'),
    name: 'incident_form_client_scripts_count',
    label: 'Client scripts on incident form (raw count)',
    collector_type: 'declarative',
    source_table: 'sys_script_client',
    filter_condition: 'table=incident^active=true',
    aggregation: 'count',
    target_value: 15,
    threshold_red: 50,
    threshold_amber: 30,
    higher_is_better: false,
    weight_in_category: 0.04571428571428571,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ph_cli5_incident_ui_policies'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_ux_variables'),
    name: 'incident_form_ui_policies_count',
    label: 'UI policies on incident form (raw count)',
    collector_type: 'declarative',
    source_table: 'sys_ui_policy',
    filter_condition: 'table=incident^active=true',
    aggregation: 'count',
    target_value: 10,
    threshold_red: 2,
    threshold_amber: 5,
    higher_is_better: true,
    weight_in_category: 0.04571428571428571,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ph_var1_help_text'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_ux_variables'),
    name: 'variables_with_help_text',
    label: 'Variables with help text (%)',
    collector_type: 'declarative',
    source_table: 'item_option_new',
    filter_condition: 'active=true^help_textISNOTEMPTY',
    aggregation: 'percentage',
    denominator_filter: 'active=true',
    target_value: 80,
    threshold_red: 25,
    threshold_amber: 50,
    higher_is_better: true,
    weight_in_category: 0.03657142857142857,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ph_var2_reference_qualifier'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_ux_variables'),
    name: 'reference_variables_with_qualifier',
    label: 'Reference variables with qualifier (%)',
    description:
      'Type 8 = Reference; OR branch via ^NQ (PRD §7.5 VAR2).',
    collector_type: 'declarative',
    source_table: 'item_option_new',
    filter_condition:
      'active=true^type=8^reference_qualISNOTEMPTY^NQactive=true^type=8^reference_qual_conditionISNOTEMPTY',
    aggregation: 'percentage',
    denominator_filter: 'active=true^type=8',
    target_value: 85,
    threshold_red: 30,
    threshold_amber: 60,
    higher_is_better: true,
    weight_in_category: 0.054857142857142854,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ph_var3_variable_set_reuse'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_ux_variables'),
    name: 'variable_set_reuse_rate',
    label: 'Catalog items using at least one variable set (%)',
    description:
      'OOTB io_set_item.sc_cat_item → variable set; distinct sc_cat_item count vs active items (PRD §7.5 VAR3). Portal catalog scope on sc_cat_item.',
    collector_type: 'script_include',
    script_include: 'MAFCrossTableRatioCollector',
    script_params: JSON.stringify({
      numerator_table: 'io_set_item',
      numerator_filter: 'sys_idISNOTEMPTY',
      numerator_distinct_field: 'sc_cat_item',
      denominator_table: 'sc_cat_item',
      denominator_filter: 'active=true',
      empty_denominator_value: 0,
      portal_catalog_scope: true,
    }),
    target_value: 60,
    threshold_red: 10,
    threshold_amber: 30,
    higher_is_better: true,
    weight_in_category: 0.054857142857142854,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_change_custom_risk_values'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_ux_variables'),
    name: 'change_custom_risk_values',
    label: 'Non-OOB risk values on change_request (count)',
    description:
      'Counts active sys_choice rows for change_request.risk whose value is not in oob_values. Tune oob_values to match baseline on your instance.',
    collector_type: 'script_include',
    script_include: 'MAFOOBChoiceComplianceCollector',
    script_params: JSON.stringify({
      table: 'change_request',
      element: 'risk',
      oob_values: ['1', '2', '3', '4'],
    }),
    target_value: 0,
    threshold_red: 12,
    threshold_amber: 6,
    higher_is_better: false,
    weight_in_category: 0.008,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_change_custom_state_values'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_ux_variables'),
    name: 'change_custom_state_values',
    label: 'Non-OOB state values on change_request (count)',
    description:
      'Counts active sys_choice rows for change_request.state outside the shipped oob_values list. Extend the list if your baseline includes additional states.',
    collector_type: 'script_include',
    script_include: 'MAFOOBChoiceComplianceCollector',
    script_params: JSON.stringify({
      table: 'change_request',
      element: 'state',
      oob_values: ['-5', '-4', '-3', '-2', '-1', '0', '1', '2', '3'],
    }),
    target_value: 0,
    threshold_red: 12,
    threshold_amber: 6,
    higher_is_better: false,
    weight_in_category: 0.004,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_incident_custom_state_values'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_ux_variables'),
    name: 'incident_custom_state_values',
    label: 'Non-OOB state values on incident (count)',
    description:
      'Default oob_values cover common numeric incident states; add values such as -50 (draft) if present in baseline sys_choice.',
    collector_type: 'script_include',
    script_include: 'MAFOOBChoiceComplianceCollector',
    script_params: JSON.stringify({
      table: 'incident',
      element: 'state',
      oob_values: ['1', '2', '3', '6', '7', '8'],
    }),
    target_value: 0,
    threshold_red: 12,
    threshold_amber: 6,
    higher_is_better: false,
    weight_in_category: 0.004,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_problem_custom_state_values'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_ux_variables'),
    name: 'problem_custom_state_values',
    label: 'Non-OOB state values on problem (count)',
    description:
      'OOTB Problem management states 101–107; oob_values includes 105 (Fix in Progress). Adjust if your baseline differs.',
    collector_type: 'script_include',
    script_include: 'MAFOOBChoiceComplianceCollector',
    script_params: JSON.stringify({
      table: 'problem',
      element: 'state',
      oob_values: ['101', '102', '103', '104', '105', '106', '107'],
    }),
    target_value: 0,
    threshold_red: 8,
    threshold_amber: 4,
    higher_is_better: false,
    weight_in_category: 0.004,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_request_custom_stage_values'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_ux_variables'),
    name: 'request_custom_stage_values',
    label: 'Non-OOB stage values on sc_request (count)',
    description:
      'Stage internal values vary by release and locale. Replace oob_values with those from sys_choice for sc_request.stage on your instance.',
    collector_type: 'script_include',
    script_include: 'MAFOOBChoiceComplianceCollector',
    script_params: JSON.stringify({
      table: 'sc_request',
      element: 'stage',
      oob_values: [
        'requested',
        'in_process',
        'delivered',
        'complete',
        'closed_complete',
        'closed_incomplete',
      ],
    }),
    target_value: 0,
    threshold_red: 10,
    threshold_amber: 5,
    higher_is_better: false,
    weight_in_category: 0.004,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ritm_custom_stage_values'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_ux_variables'),
    name: 'ritm_custom_stage_values',
    label: 'Non-OOB stage values on sc_req_item (count)',
    description:
      'Stage internal values vary by release. Align oob_values with sys_choice for sc_req_item.stage.',
    collector_type: 'script_include',
    script_include: 'MAFOOBChoiceComplianceCollector',
    script_params: JSON.stringify({
      table: 'sc_req_item',
      element: 'stage',
      oob_values: [
        'awaiting_approval',
        'work_in_progress',
        'closed_complete',
        'closed_incomplete',
        'delivered',
        'pending',
        'ordered',
        'ready',
      ],
    }),
    target_value: 0,
    threshold_red: 10,
    threshold_amber: 5,
    higher_is_better: false,
    weight_in_category: 0.004,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_task_custom_impact_values'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_ux_variables'),
    name: 'task_custom_impact_values',
    label: 'Non-OOB impact values on task (count)',
    description: 'Default OOTB task impact 1–3 (High / Medium / Low).',
    collector_type: 'script_include',
    script_include: 'MAFOOBChoiceComplianceCollector',
    script_params: JSON.stringify({
      table: 'task',
      element: 'impact',
      oob_values: ['1', '2', '3'],
    }),
    target_value: 0,
    threshold_red: 6,
    threshold_amber: 3,
    higher_is_better: false,
    weight_in_category: 0.004,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_task_custom_priority_values'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_ux_variables'),
    name: 'task_custom_priority_values',
    label: 'Non-OOB priority values on task (count)',
    description: 'Default OOTB task priority 1–5.',
    collector_type: 'script_include',
    script_include: 'MAFOOBChoiceComplianceCollector',
    script_params: JSON.stringify({
      table: 'task',
      element: 'priority',
      oob_values: ['1', '2', '3', '4', '5'],
    }),
    target_value: 0,
    threshold_red: 8,
    threshold_amber: 4,
    higher_is_better: false,
    weight_in_category: 0.004,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_task_custom_urgency_values'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_ux_variables'),
    name: 'task_custom_urgency_values',
    label: 'Non-OOB urgency values on task (count)',
    description: 'Default OOTB task urgency 1–3.',
    collector_type: 'script_include',
    script_include: 'MAFOOBChoiceComplianceCollector',
    script_params: JSON.stringify({
      table: 'task',
      element: 'urgency',
      oob_values: ['1', '2', '3'],
    }),
    target_value: 0,
    threshold_red: 6,
    threshold_amber: 3,
    higher_is_better: false,
    weight_in_category: 0.004,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ph_tax1_taxonomy_exists'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_catalog_taxonomy'),
    name: 'taxonomy_exists',
    label: 'Taxonomy links on default portal (raw count)',
    description:
      'Rows in m2m_sp_portal_taxonomy for the default sp_portal (inactive=false, default=true, else first by title). Replaces counting all taxonomy records.',
    collector_type: 'script_include',
    script_include: 'MAFPortalMetricsCollector',
    script_params: JSON.stringify({ mode: 'taxonomy_m2m_count' }),
    target_value: 2,
    threshold_red: 0,
    threshold_amber: 1,
    higher_is_better: true,
    weight_in_category: 0.027428571428571427,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ph_tax2_topic_depth'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_catalog_taxonomy'),
    name: 'taxonomy_topic_depth',
    label: 'Topics with a parent topic (%)',
    description:
      'OOTB topic.parent_topic. Numerator/denominator limited to topic.taxonomy IN taxonomies linked to the default portal (m2m_sp_portal_taxonomy).',
    collector_type: 'script_include',
    script_include: 'MAFPortalMetricsCollector',
    script_params: JSON.stringify({ mode: 'topic_parent_depth_percentage' }),
    target_value: 50,
    threshold_red: 5,
    threshold_amber: 20,
    higher_is_better: true,
    weight_in_category: 0.03657142857142857,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ph_tax3_catalog_items_with_topic'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_catalog_taxonomy'),
    name: 'catalog_items_with_topic',
    label: 'Active catalog items linked to a topic (%)',
    description:
      'Portal default catalogs only. Primary: sc_cat_item.taxonomy_topic. M2M topic links (m2m_connected_content) are not counted here.',
    collector_type: 'script_include',
    script_include: 'MAFPortalMetricsCollector',
    script_params: JSON.stringify({
      mode: 'sc_cat_item_percentage',
      numerator_suffix: 'active=true^taxonomy_topicISNOTEMPTY',
      denominator_suffix: 'active=true',
    }),
    target_value: 80,
    threshold_red: 20,
    threshold_amber: 50,
    higher_is_better: true,
    weight_in_category: 0.054857142857142854,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ph_cd1_custom_br_incident'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_custom_code'),
    name: 'custom_business_rules_on_incident',
    label: 'Active custom business rules on incident (raw count)',
    description:
      'sys_package.source filter may fail on some instances; adjust per environment (PRD §7.8).',
    collector_type: 'declarative',
    source_table: 'sys_script',
    filter_condition: 'collection=incident^active=true^sys_package.source!=com.snc.incident',
    aggregation: 'count',
    target_value: 10,
    threshold_red: 50,
    threshold_amber: 25,
    higher_is_better: false,
    weight_in_category: 0.054857142857142854,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ph_cd2_custom_cs_incident'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_custom_code'),
    name: 'custom_client_scripts_on_incident',
    label: 'Active custom client scripts on incident (raw count)',
    description:
      'sys_package.source filter may fail on some instances; adjust per environment (PRD §7.8).',
    collector_type: 'declarative',
    source_table: 'sys_script_client',
    filter_condition: 'table=incident^active=true^sys_package.source!=com.snc.incident',
    aggregation: 'count',
    target_value: 10,
    threshold_red: 50,
    threshold_amber: 25,
    higher_is_better: false,
    weight_in_category: 0.04571428571428571,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ph_cd3_custom_br_change'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_custom_code'),
    name: 'custom_business_rules_on_change',
    label: 'Active custom business rules on change_request (raw count)',
    description:
      'sys_package.source filter may fail on some instances; adjust per environment (PRD §7.8).',
    collector_type: 'declarative',
    source_table: 'sys_script',
    filter_condition:
      'collection=change_request^active=true^sys_package.source!=com.snc.change_management',
    aggregation: 'count',
    target_value: 10,
    threshold_red: 50,
    threshold_amber: 25,
    higher_is_better: false,
    weight_in_category: 0.04571428571428571,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ph_cd4_modified_oob_br'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_custom_code'),
    name: 'modified_oob_business_rules',
    label: 'OOTB business rules marked customer-updated (raw count)',
    collector_type: 'declarative',
    source_table: 'sys_script',
    filter_condition: 'sys_update_nameLIKEsys_script_^sys_customer_update=true',
    aggregation: 'count',
    target_value: 0,
    threshold_red: 20,
    threshold_amber: 5,
    higher_is_better: false,
    weight_in_category: 0.054857142857142854,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ph_not1_notifications_active'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_notifications_sla'),
    name: 'notifications_active_count',
    label: 'Active ITSM email notifications (raw count)',
    collector_type: 'declarative',
    source_table: 'sysevent_email_action',
    filter_condition:
      'active=true^collectionINincident,problem,change_request,sc_req_item',
    aggregation: 'count',
    target_value: 50,
    threshold_red: 200,
    threshold_amber: 100,
    higher_is_better: false,
    weight_in_category: 0.027428571428571427,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ph_not2_notifications_templates'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_notifications_sla'),
    name: 'notifications_using_templates',
    label: 'Active ITSM notifications using a template (%)',
    collector_type: 'declarative',
    source_table: 'sysevent_email_action',
    filter_condition:
      'active=true^collectionINincident,problem,change_request,sc_req_item^message_templateISNOTEMPTY',
    aggregation: 'percentage',
    denominator_filter:
      'active=true^collectionINincident,problem,change_request,sc_req_item',
    target_value: 70,
    threshold_red: 15,
    threshold_amber: 40,
    higher_is_better: true,
    weight_in_category: 0.027428571428571427,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ph_sla1_definitions_schedule'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_notifications_sla'),
    name: 'sla_definitions_with_schedule',
    label: 'SLA definitions with schedule set (%)',
    collector_type: 'declarative',
    source_table: 'contract_sla',
    filter_condition: 'active=true^scheduleISNOTEMPTY',
    aggregation: 'percentage',
    denominator_filter: 'active=true',
    target_value: 95,
    threshold_red: 50,
    threshold_amber: 80,
    higher_is_better: true,
    weight_in_category: 0.027428571428571427,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ph_sla2_definitions_pause'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_platform_hygiene'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ph_notifications_sla'),
    name: 'sla_definitions_with_pause',
    label: 'SLA definitions with pause condition (%)',
    collector_type: 'declarative',
    source_table: 'contract_sla',
    filter_condition: 'active=true^pause_conditionISNOTEMPTY',
    aggregation: 'percentage',
    denominator_filter: 'active=true',
    target_value: 60,
    threshold_red: 10,
    threshold_amber: 30,
    higher_is_better: true,
    weight_in_category: 0.018285714285714284,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ar_asn1_awa_channels'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_automation_reuse'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_automation_reuse'),
    name: 'awa_adoption',
    label: 'AWA service channels defined (raw count)',
    collector_type: 'declarative',
    source_table: 'awa_service_channel',
    filter_condition: 'active=true',
    aggregation: 'count',
    target_value: 2,
    threshold_red: 0,
    threshold_amber: 1,
    higher_is_better: true,
    weight_in_category: 0.08,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ar_asn2_awa_assignment_rate'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_automation_reuse'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_automation_reuse'),
    name: 'awa_assignment_rate',
    label: 'AWA assignments vs resolved incidents (30d) (%)',
    description: 'Verify awa_assignment table on your instance (PRD §7.7 ASN2).',
    collector_type: 'script_include',
    script_include: 'MAFCrossTableRatioCollector',
    script_params: JSON.stringify({
      numerator_table: 'awa_assignment',
      numerator_filter: 'sys_created_on>=javascript:gs.daysAgoStart(30)',
      denominator_table: 'incident',
      denominator_filter: 'stateIN6,7^resolved_at>=javascript:gs.daysAgoStart(30)',
      empty_denominator_value: 0,
    }),
    target_value: 40,
    threshold_red: 5,
    threshold_amber: 20,
    higher_is_better: true,
    weight_in_category: 0.1,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ar_asn3_assignment_rules'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_automation_reuse'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_automation_reuse'),
    name: 'assignment_rule_count',
    label: 'Active assignment rules (raw count)',
    collector_type: 'declarative',
    source_table: 'sysrule_assignment',
    filter_condition: 'active=true',
    aggregation: 'count',
    target_value: 20,
    threshold_red: 100,
    threshold_amber: 50,
    higher_is_better: false,
    weight_in_category: 0.05,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_ar_asn4_data_lookup_assignment'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_automation_reuse'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_automation_reuse'),
    name: 'data_lookup_for_assignment',
    label: 'Data Lookup definitions for ITSM tables (raw count)',
    collector_type: 'declarative',
    source_table: 'dl_definition',
    filter_condition:
      'active=true^source_tableINincident,change_request,sc_req_item',
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
  $id: Now.ID['maf_seed_ar_asn5_incident_auto_assigned'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_automation_reuse'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_automation_reuse'),
    name: 'incident_auto_assigned_rate',
    label: 'Resolved incidents with assignment group at open (%)',
    description:
      'Retired (ITSM pack v3): duplicate of assignment_group_at_resolve (M4). Row kept inactive for audit trail.',
    collector_type: 'declarative',
    source_table: 'incident',
    filter_condition: 'stateIN6,7^assignment_groupISNOTEMPTY',
    aggregation: 'percentage',
    denominator_filter: 'stateIN6,7',
    target_value: 70,
    threshold_red: 15,
    threshold_amber: 40,
    higher_is_better: true,
    weight_in_category: 0,
    unit: '%',
    active: false,
  },
})

/**
 * New Data Quality metrics (v3.1) — change documentation and incident close notes quality.
 */
Record({
  $id: Now.ID['maf_seed_dq_change_test_plan'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_data_quality'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_data_quality_fields'),
    name: 'change_test_plan_documented',
    label: 'Changes with test plan documented (%)',
    description:
      'OOTB change_request.test_plan field. Measures share of closed changes (state=3) with a test plan populated. Complements backout_plan (C5) for ITIL change documentation completeness.',
    collector_type: 'declarative',
    source_table: 'change_request',
    filter_condition: 'state=3^test_planISNOTEMPTY',
    aggregation: 'percentage',
    denominator_filter: 'state=3',
    target_value: 90,
    threshold_red: 40,
    threshold_amber: 70,
    higher_is_better: true,
    weight_in_category: 0.06,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_dq_change_risk_assessment'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_data_quality'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_data_quality_fields'),
    name: 'change_risk_assessment_populated',
    label: 'Changes with risk assessment populated (%)',
    description:
      'OOTB change_request.risk_impact_analysis field. Measures share of closed changes (state=3) with risk impact analysis documented. Supports ITIL4 risk-based change management.',
    collector_type: 'declarative',
    source_table: 'change_request',
    filter_condition: 'state=3^risk_impact_analysisISNOTEMPTY',
    aggregation: 'percentage',
    denominator_filter: 'state=3',
    target_value: 85,
    threshold_red: 30,
    threshold_amber: 60,
    higher_is_better: true,
    weight_in_category: 0.05,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_dq_incident_close_notes'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_data_quality'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_data_quality_fields'),
    name: 'incident_close_notes_quality',
    label: 'Resolved incidents with close notes ≥ 20 chars (%)',
    description:
      'Measures resolution documentation quality. Uses LIKE pattern of 20 underscores for minimum length (same approach as short_description_length M3). stateIN6,7 = Resolved or Closed.',
    collector_type: 'declarative',
    source_table: 'incident',
    filter_condition:
      'stateIN6,7^close_notesISNOTEMPTY^close_notesLIKE____________________',
    aggregation: 'percentage',
    denominator_filter: 'stateIN6,7',
    target_value: 90,
    threshold_red: 40,
    threshold_amber: 65,
    higher_is_better: true,
    weight_in_category: 0.05,
    unit: '%',
    active: true,
  },
})

/**
 * New Operational Performance metrics (v3.1) — RITM cancellation and problem closure velocity.
 */
Record({
  $id: Now.ID['maf_seed_op_ritm_cancellation_rate'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_operational'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ops_backlog_volume'),
    name: 'ritm_cancellation_rate',
    label: 'RITM cancellation rate (%)',
    description:
      'Share of closed RITMs that were cancelled. High cancellation indicates catalog confusion, poor descriptions, or ordering mistakes. Complements RITM fulfillment time (R2).',
    collector_type: 'declarative',
    source_table: 'sc_req_item',
    filter_condition: 'stage=cancelled',
    aggregation: 'percentage',
    denominator_filter: 'stateIN3,4',
    target_value: 5,
    threshold_red: 25,
    threshold_amber: 12,
    higher_is_better: false,
    weight_in_category: 0.04,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_seed_op_problem_closure_rate'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_operational'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_ops_backlog_volume'),
    name: 'problem_closure_rate_90d',
    label: 'Problem closure rate — last 90 days (%)',
    description:
      'Share of problems opened in the last 90 days that have reached Resolved (106) or Closed (107). Measures problem management throughput and velocity. Complements backlog age (P3) and root cause documentation (P1).',
    collector_type: 'declarative',
    source_table: 'problem',
    filter_condition:
      'opened_at>=javascript:gs.daysAgoStart(90)^stateIN106,107',
    aggregation: 'percentage',
    denominator_filter: 'opened_at>=javascript:gs.daysAgoStart(90)',
    target_value: 70,
    threshold_red: 20,
    threshold_amber: 45,
    higher_is_better: true,
    weight_in_category: 0.04,
    unit: '%',
    active: true,
  },
})

/**
 * New Automation & Reuse metric (v3.1) — self-service channel shift.
 * Replaces retired incident_auto_assigned_rate (ASN5).
 */
Record({
  $id: Now.ID['maf_seed_ar_self_service_ratio'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_seed_cat_automation_reuse'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_seed_sub_itsm_automation_reuse'),
    name: 'self_service_incident_ratio',
    label: 'Self-service incident ratio (%)',
    description:
      'Share of incidents opened via self-service portal (contact_type=self-service) vs all incidents. Core ITSM maturity indicator — channel shift from phone/email to self-service is the primary demand management lever. contact_type values vary by instance; adjust filter if needed.',
    collector_type: 'declarative',
    source_table: 'incident',
    filter_condition: 'active=true^contact_type=self-service',
    aggregation: 'percentage',
    denominator_filter: 'active=true',
    target_value: 60,
    threshold_red: 10,
    threshold_amber: 30,
    higher_is_better: true,
    weight_in_category: 0.05,
    unit: '%',
    active: true,
  },
})
