import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

const SP_SVC_GOV_BIZ_SVC = JSON.stringify({
  table: 'cmdb_ci_service',
  filter: 'sys_class_name=cmdb_ci_service',
  fields: ['support_group', 'change_control', 'managed_by', 'owned_by'],
})
const SP_SVC_GOV_TECH_SVC = JSON.stringify({
  table: 'cmdb_ci_service',
  filter: 'sys_class_name=cmdb_ci_service_technical',
  fields: ['support_group', 'change_control', 'managed_by', 'owned_by'],
})
const SP_SVC_GOV_OFFERING = JSON.stringify({
  table: 'service_offering',
  filter: '',
  fields: ['support_group', 'change_control', 'managed_by', 'owned_by'],
})
const SP_SVC_GOV_PORTFOLIO = JSON.stringify({
  table: 'spm_service_portfolio',
  filter: '',
  fields: ['service_portfolio_manager', 'service_portfolio_owner'],
})
const SP_CSDM_APP_BIZ = JSON.stringify({
  app_class: 'cmdb_ci_appl',
  relationship_hint: 'Depends on::Used by',
})
const SP_DISCOVERY_LAST_RUN = JSON.stringify({
  table: 'discovery_status',
  date_field: 'sys_updated_on',
  state_field: 'state',
  complete_states: 'Complete,Finished',
})
const SP_SERVICE_MAPPING = JSON.stringify({
  tables: ['sm_m2m_pattern_ci', 'service_mapping_pattern'],
  plugin_id: 'com.service-now.service-mapping',
})
const SP_CMDB_HEALTH = JSON.stringify({
  plugin_ids: ['com.snc.cmdb.health', 'com.service-now.cmdb-health'],
  optional_property: 'cmdb.health.enabled',
})

Record({
  $id: Now.ID['maf_cmdb_pack'],
  table: 'x_maf_core_pack',
  data: {
    name: 'cmdb_csdm',
    label: 'CMDB & CSDM Maturity',
    description:
      'Configuration management and CSDM alignment: completeness, service taxonomy, data quality, relationships, discovery, and CMDB health.',
    version: '1.0.0',
    vendor: 'MAF Core',
    active: true,
    order: 120,
  },
})

Record({
  $id: Now.ID['maf_cmdb_cat_ci_completeness'],
  table: 'x_maf_core_category',
  data: {
    pack: Now.ref('x_maf_core_pack', 'maf_cmdb_pack'),
    name: 'ci_completeness',
    label: 'CI completeness',
    description: 'Classification, discovery source, operational status, staleness, orphan relationships.',
    weight: 0.18,
    order: 10,
  },
})

Record({
  $id: Now.ID['maf_cmdb_cat_csdm_alignment'],
  table: 'x_maf_core_category',
  data: {
    pack: Now.ref('x_maf_core_pack', 'maf_cmdb_pack'),
    name: 'csdm_alignment',
    label: 'CSDM alignment',
    description: 'Business, technical, and application services; offerings; CI-to-service mapping.',
    weight: 0.20,
    order: 20,
  },
})

Record({
  $id: Now.ID['maf_cmdb_cat_cmdb_data_quality'],
  table: 'x_maf_core_category',
  data: {
    pack: Now.ref('x_maf_core_pack', 'maf_cmdb_pack'),
    name: 'cmdb_data_quality',
    label: 'CMDB data quality',
    description: 'Duplicates, ownership, support groups.',
    weight: 0.16,
    order: 30,
  },
})

Record({
  $id: Now.ID['maf_cmdb_cat_cmdb_relationships'],
  table: 'x_maf_core_category',
  data: {
    pack: Now.ref('x_maf_core_pack', 'maf_cmdb_pack'),
    name: 'cmdb_relationships',
    label: 'Relationships',
    description: 'Relationship diversity and density.',
    weight: 0.14,
    order: 40,
  },
})

Record({
  $id: Now.ID['maf_cmdb_cat_discovery_ingestion'],
  table: 'x_maf_core_category',
  data: {
    pack: Now.ref('x_maf_core_pack', 'maf_cmdb_pack'),
    name: 'discovery_ingestion',
    label: 'Discovery & ingestion',
    description: 'Discovery schedules, last run age, service mapping.',
    weight: 0.14,
    order: 50,
  },
})

Record({
  $id: Now.ID['maf_cmdb_cat_cmdb_health_dash'],
  table: 'x_maf_core_category',
  data: {
    pack: Now.ref('x_maf_core_pack', 'maf_cmdb_pack'),
    name: 'cmdb_health_dashboard',
    label: 'CMDB health dashboard',
    description: 'CMDB Health / dashboard integration.',
    weight: 0.08,
    order: 60,
  },
})

Record({
  $id: Now.ID['maf_cmdb_sub_ci_completeness'],
  table: 'x_maf_core_sub_category',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_ci_completeness'),
    name: 'cmdb_sub_ci_completeness',
    label: 'CI completeness',
    description: 'Single sub-category for CI completeness metrics.',
    weight_in_category: 1,
    order: 1,
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cmdb_sub_csdm_alignment'],
  table: 'x_maf_core_sub_category',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_csdm_alignment'),
    name: 'cmdb_sub_csdm_alignment',
    label: 'CSDM alignment',
    description: 'CSDM taxonomy and mapping.',
    weight_in_category: 1,
    order: 1,
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cmdb_sub_cmdb_data_quality'],
  table: 'x_maf_core_sub_category',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_cmdb_data_quality'),
    name: 'cmdb_sub_data_quality',
    label: 'CMDB data quality',
    description: 'Duplicates and ownership.',
    weight_in_category: 1,
    order: 1,
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cmdb_sub_cmdb_relationships'],
  table: 'x_maf_core_sub_category',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_cmdb_relationships'),
    name: 'cmdb_sub_relationships',
    label: 'Relationships',
    description: 'Relationship metrics.',
    weight_in_category: 1,
    order: 1,
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cmdb_sub_discovery_ingestion'],
  table: 'x_maf_core_sub_category',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_discovery_ingestion'),
    name: 'cmdb_sub_discovery',
    label: 'Discovery & ingestion',
    description: 'Discovery and service mapping.',
    weight_in_category: 1,
    order: 1,
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cmdb_sub_cmdb_health_dash'],
  table: 'x_maf_core_sub_category',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_cmdb_health_dash'),
    name: 'cmdb_sub_health_dash',
    label: 'CMDB health dashboard',
    description: 'Health integration.',
    weight_in_category: 1,
    order: 1,
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cmdb_m_class_coverage'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_ci_completeness'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_cmdb_sub_ci_completeness'),
    name: 'cmdb_ci_class_coverage',
    label: 'CI class coverage (beyond base cmdb_ci)',
    description:
      'Share of CIs whose class is more specific than root cmdb_ci. Calibrate denominator to your CMDB scope.',
    collector_type: 'declarative',
    source_table: 'cmdb_ci',
    filter_condition: 'sys_class_name!=cmdb_ci',
    aggregation: 'percentage',
    denominator_filter: 'sys_idISNOTEMPTY',
    target_value: 98,
    threshold_red: 70,
    threshold_amber: 85,
    higher_is_better: true,
    weight_in_category: 0.2,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cmdb_m_discovery_source'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_ci_completeness'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_cmdb_sub_ci_completeness'),
    name: 'cmdb_ci_discovery_source_populated',
    label: 'CI discovery source populated',
    description: 'Percentage of CIs with discovery_source populated.',
    collector_type: 'declarative',
    source_table: 'cmdb_ci',
    filter_condition: 'discovery_sourceISNOTEMPTY',
    aggregation: 'percentage',
    denominator_filter: 'sys_idISNOTEMPTY',
    target_value: 90,
    threshold_red: 50,
    threshold_amber: 75,
    higher_is_better: true,
    weight_in_category: 0.2,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cmdb_m_operational_status'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_ci_completeness'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_cmdb_sub_ci_completeness'),
    name: 'cmdb_ci_operational_status_populated',
    label: 'CI operational status populated',
    description: 'Percentage of CIs with operational_status set.',
    collector_type: 'declarative',
    source_table: 'cmdb_ci',
    filter_condition: 'operational_statusISNOTEMPTY',
    aggregation: 'percentage',
    denominator_filter: 'sys_idISNOTEMPTY',
    target_value: 95,
    threshold_red: 60,
    threshold_amber: 80,
    higher_is_better: true,
    weight_in_category: 0.2,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cmdb_m_staleness_90d'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_ci_completeness'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_cmdb_sub_ci_completeness'),
    name: 'cmdb_ci_staleness_90d',
    label: 'CI staleness (not updated in 90 days)',
    description: 'Percentage of CIs with sys_updated_on older than 90 days.',
    collector_type: 'declarative',
    source_table: 'cmdb_ci',
    filter_condition: 'sys_updated_on<javascript:gs.daysAgoStart(90)',
    aggregation: 'percentage',
    denominator_filter: 'sys_idISNOTEMPTY',
    target_value: 10,
    threshold_red: 50,
    threshold_amber: 30,
    higher_is_better: false,
    weight_in_category: 0.2,
    unit: '%',
    active: true,
    default_likely_cause:
      'Discovery schedules are failing, excluded ranges have drifted, or a large class of CIs is maintained only manually. MID servers may be offline or credentials expired.',
    default_suggested_action:
      'Audit discovery schedules and MID server health, widen credential coverage for the top non-updating classes, and retire CIs that remain stale for more than 180 days.',
    default_owner_role: 'platform_owner',
    default_effort_tshirt: 'm',
    default_quick_win_flag: false,
  },
})

Record({
  $id: Now.ID['maf_cmdb_m_orphan_rate'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_ci_completeness'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_cmdb_sub_ci_completeness'),
    name: 'cmdb_ci_orphan_rate',
    label: 'CI orphan rate (no relationships)',
    description: 'Percentage of CIs with no cmdb_rel_ci as parent or child.',
    collector_type: 'script_include',
    script_include: 'MAFCmdbOrphanRateCollector',
    script_params: '{}',
    target_value: 5,
    threshold_red: 40,
    threshold_amber: 20,
    higher_is_better: false,
    weight_in_category: 0.2,
    unit: '%',
    active: true,
    default_likely_cause:
      'Discovery is populating CIs but relationship patterns (Service Mapping or suggested relationships) are not running or not accepted. Manually created CIs rarely get relationships added back.',
    default_suggested_action:
      'Run Service Mapping against the top business services, enable suggested relationships, and add a monthly stewardship check that removes or archives CIs still orphaned after 60 days.',
    default_owner_role: 'data_steward',
    default_effort_tshirt: 'l',
    default_quick_win_flag: false,
  },
})

Record({
  $id: Now.ID['maf_cmdb_m_business_svc_count'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_csdm_alignment'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_cmdb_sub_csdm_alignment'),
    name: 'csdm_business_service_count',
    label: 'Business services (count)',
    description: 'Count of cmdb_ci_service rows with class cmdb_ci_service.',
    collector_type: 'declarative',
    source_table: 'cmdb_ci_service',
    filter_condition: 'sys_class_name=cmdb_ci_service',
    aggregation: 'count',
    target_value: 20,
    threshold_red: 0,
    threshold_amber: 5,
    higher_is_better: true,
    weight_in_category: 0.2,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cmdb_m_service_offering_count'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_csdm_alignment'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_cmdb_sub_csdm_alignment'),
    name: 'csdm_service_offering_count',
    label: 'Service offerings (count)',
    description: 'Active service_offering records.',
    collector_type: 'declarative',
    source_table: 'service_offering',
    filter_condition: 'active=true',
    aggregation: 'count',
    target_value: 10,
    threshold_red: 0,
    threshold_amber: 2,
    higher_is_better: true,
    weight_in_category: 0.2,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cmdb_m_technical_svc_count'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_csdm_alignment'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_cmdb_sub_csdm_alignment'),
    name: 'csdm_technical_service_count',
    label: 'Technical services (count)',
    description:
      'Technical service CIs (default cmdb_ci_service_technical — verify class on your instance).',
    collector_type: 'declarative',
    source_table: 'cmdb_ci_service',
    filter_condition: 'sys_class_name=cmdb_ci_service_technical',
    aggregation: 'count',
    target_value: 15,
    threshold_red: 0,
    threshold_amber: 3,
    higher_is_better: true,
    weight_in_category: 0.2,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cmdb_m_app_linked_biz'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_csdm_alignment'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_cmdb_sub_csdm_alignment'),
    name: 'csdm_app_service_linked_to_biz',
    label: 'Application services linked (%)',
    description:
      'Share of application CIs with at least one cmdb_rel_ci row as child (simplified heuristic).',
    collector_type: 'script_include',
    script_include: 'MAFCsdmAppToBizLinkCollector',
    script_params: SP_CSDM_APP_BIZ,
    target_value: 85,
    threshold_red: 40,
    threshold_amber: 65,
    higher_is_better: true,
    weight_in_category: 0.2,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cmdb_m_ci_svc_mapping_rate'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_csdm_alignment'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_cmdb_sub_csdm_alignment'),
    name: 'csdm_ci_to_service_mapping_rate',
    label: 'CIs mapped to at least one service (%)',
    description: 'svc_ci_assoc and Depends-on cmdb_rel_ci coverage of CIs.',
    collector_type: 'script_include',
    script_include: 'MAFCiServiceMappingRateCollector',
    script_params: '{}',
    target_value: 80,
    threshold_red: 35,
    threshold_amber: 55,
    higher_is_better: true,
    weight_in_category: 0.2,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cmdb_m_duplicate_rate'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_cmdb_data_quality'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_cmdb_sub_cmdb_data_quality'),
    name: 'cmdb_duplicate_ci_rate',
    label: 'Potential duplicate CI rate',
    description: 'Heuristic: name + class + serial_number collision rate among CIs with serial.',
    collector_type: 'script_include',
    script_include: 'MAFCmdbDuplicateRateCollector',
    script_params: '{}',
    target_value: 2,
    threshold_red: 25,
    threshold_amber: 10,
    higher_is_better: false,
    weight_in_category: 0.34,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cmdb_m_no_owner'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_cmdb_data_quality'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_cmdb_sub_cmdb_data_quality'),
    name: 'cmdb_ci_no_owner',
    label: 'CIs without owner (managed_by / owned_by) (%)',
    description: 'Percentage where both managed_by and owned_by are empty.',
    collector_type: 'script_include',
    script_include: 'MAFCmdbNoOwnerCollector',
    script_params: '{}',
    target_value: 10,
    threshold_red: 50,
    threshold_amber: 30,
    higher_is_better: false,
    weight_in_category: 0.33,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cmdb_m_no_support_group'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_cmdb_data_quality'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_cmdb_sub_cmdb_data_quality'),
    name: 'cmdb_ci_no_support_group',
    label: 'CIs without support group (%)',
    description: 'Percentage of CIs with empty support_group.',
    collector_type: 'declarative',
    source_table: 'cmdb_ci',
    filter_condition: 'support_groupISEMPTY',
    aggregation: 'percentage',
    denominator_filter: 'sys_idISNOTEMPTY',
    target_value: 8,
    threshold_red: 45,
    threshold_amber: 25,
    higher_is_better: false,
    weight_in_category: 0.33,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cmdb_m_avg_rel'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_cmdb_relationships'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_cmdb_sub_cmdb_relationships'),
    name: 'cmdb_ci_avg_relationships',
    label: 'Average relationships per CI',
    description: 'cmdb_rel_ci row count divided by cmdb_ci count (approximate).',
    collector_type: 'script_include',
    script_include: 'MAFCmdbAvgRelPerCiCollector',
    script_params: '{}',
    target_value: 4,
    threshold_red: 0.5,
    threshold_amber: 2,
    higher_is_better: true,
    weight_in_category: 0.5,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cmdb_m_rel_type_diversity'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_cmdb_relationships'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_cmdb_sub_cmdb_relationships'),
    name: 'cmdb_rel_type_diversity',
    label: 'Distinct relationship types in use (count)',
    description: 'Count of distinct cmdb_rel_ci.type values in use.',
    collector_type: 'script_include',
    script_include: 'MAFCmdbRelTypeDistinctCollector',
    script_params: '{}',
    target_value: 15,
    threshold_red: 2,
    threshold_amber: 5,
    higher_is_better: true,
    weight_in_category: 0.5,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cmdb_m_discovery_schedule'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_discovery_ingestion'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_cmdb_sub_discovery_ingestion'),
    name: 'discovery_schedule_active',
    label: 'Active discovery schedules (count)',
    description: 'Active discovery_schedule rows (verify table exists if Discovery not licensed).',
    collector_type: 'declarative',
    source_table: 'discovery_schedule',
    filter_condition: 'active=true',
    aggregation: 'count',
    target_value: 3,
    threshold_red: 0,
    threshold_amber: 1,
    higher_is_better: true,
    weight_in_category: 0.34,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cmdb_m_discovery_last_run'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_discovery_ingestion'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_cmdb_sub_discovery_ingestion'),
    name: 'discovery_last_run_age',
    label: 'Days since last discovery run',
    description: 'Days since most recent discovery_status row (tune table/fields per instance).',
    collector_type: 'script_include',
    script_include: 'MAFDiscoveryLastRunAgeCollector',
    script_params: SP_DISCOVERY_LAST_RUN,
    target_value: 1,
    threshold_red: 30,
    threshold_amber: 14,
    higher_is_better: false,
    weight_in_category: 0.33,
    unit: 'days',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cmdb_m_service_mapping'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_discovery_ingestion'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_cmdb_sub_discovery_ingestion'),
    name: 'service_mapping_active',
    label: 'Service mapping pattern rows (count)',
    description: 'Row count across service mapping pattern tables; optional plugin gate.',
    collector_type: 'script_include',
    script_include: 'MAFServiceMappingActiveCollector',
    script_params: SP_SERVICE_MAPPING,
    target_value: 5,
    threshold_red: 0,
    threshold_amber: 1,
    higher_is_better: true,
    weight_in_category: 0.33,
    unit: 'count',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cmdb_m_health_integration'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_cmdb_health_dash'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_cmdb_sub_cmdb_health_dash'),
    name: 'cmdb_health_score_integration',
    label: 'CMDB Health integration active',
    description: 'CMDB Health plugin active or optional cmdb.health.enabled property.',
    collector_type: 'script_include',
    script_include: 'MAFCmdbHealthIntegrationCollector',
    script_params: SP_CMDB_HEALTH,
    target_value: 100,
    threshold_red: 0,
    threshold_amber: 50,
    higher_is_better: true,
    weight_in_category: 1,
    unit: '%',
    active: true,
  },
})

// ─── Service Governance category ─────────────────────────────────────────────

Record({
  $id: Now.ID['maf_cmdb_cat_svc_governance'],
  table: 'x_maf_core_category',
  data: {
    pack: Now.ref('x_maf_core_pack', 'maf_cmdb_pack'),
    name: 'svc_governance',
    label: 'Service governance fields',
    description:
      'Governance field population (support_group, change_group, managed_by, owned_by) across business services, technical services, service offerings, and service portfolios.',
    weight: 0.1,
    order: 70,
  },
})

Record({
  $id: Now.ID['maf_cmdb_sub_svc_governance'],
  table: 'x_maf_core_sub_category',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_svc_governance'),
    name: 'cmdb_sub_svc_governance',
    label: 'Service governance fields',
    description: 'Governance field completeness per service layer.',
    weight_in_category: 1,
    order: 1,
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cmdb_m_svc_gov_biz_svc'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_svc_governance'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_cmdb_sub_svc_governance'),
    name: 'svc_gov_business_service_fields',
    label: 'Business service governance fields populated (%)',
    description:
      'Percentage of cmdb_ci_service (class=cmdb_ci_service) records with support_group, change_control, managed_by, and owned_by all populated.',
    collector_type: 'script_include',
    script_include: 'MAFServiceGovernanceFieldsCollector',
    script_params: SP_SVC_GOV_BIZ_SVC,
    target_value: 90,
    threshold_red: 40,
    threshold_amber: 70,
    higher_is_better: true,
    weight_in_category: 0.25,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cmdb_m_svc_gov_tech_svc'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_svc_governance'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_cmdb_sub_svc_governance'),
    name: 'svc_gov_technical_service_fields',
    label: 'Technical service governance fields populated (%)',
    description:
      'Percentage of cmdb_ci_service_technical records with support_group, change_control, managed_by, and owned_by all populated.',
    collector_type: 'script_include',
    script_include: 'MAFServiceGovernanceFieldsCollector',
    script_params: SP_SVC_GOV_TECH_SVC,
    target_value: 85,
    threshold_red: 35,
    threshold_amber: 65,
    higher_is_better: true,
    weight_in_category: 0.25,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cmdb_m_svc_gov_offering'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_svc_governance'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_cmdb_sub_svc_governance'),
    name: 'svc_gov_service_offering_fields',
    label: 'Service offering governance fields populated (%)',
    description:
      'Percentage of service_offering records with support_group, change_control, managed_by, and owned_by all populated.',
    collector_type: 'script_include',
    script_include: 'MAFServiceGovernanceFieldsCollector',
    script_params: SP_SVC_GOV_OFFERING,
    target_value: 85,
    threshold_red: 30,
    threshold_amber: 60,
    higher_is_better: true,
    weight_in_category: 0.25,
    unit: '%',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cmdb_m_svc_gov_portfolio'],
  table: 'x_maf_core_metric_definition',
  data: {
    category: Now.ref('x_maf_core_category', 'maf_cmdb_cat_svc_governance'),
    sub_category: Now.ref('x_maf_core_sub_category', 'maf_cmdb_sub_svc_governance'),
    name: 'svc_gov_service_portfolio_fields',
    label: 'Service portfolio governance fields populated (%)',
    description:
      'Percentage of spm_service_portfolio records with service_portfolio_manager and service_portfolio_owner populated. Returns null if the SPM module is not installed.',
    collector_type: 'script_include',
    script_include: 'MAFServiceGovernanceFieldsCollector',
    script_params: SP_SVC_GOV_PORTFOLIO,
    target_value: 80,
    threshold_red: 25,
    threshold_amber: 55,
    higher_is_better: true,
    weight_in_category: 0.25,
    unit: '%',
    active: true,
  },
})
