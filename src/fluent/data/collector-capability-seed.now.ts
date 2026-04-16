import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

/**
 * Documentation catalog of the reusable collectors shipped with MAF Core
 * (plan phase 3). Pack authors reference these rows when picking a collector
 * for a new metric. Not enforced at runtime — rows may drift from code; audit
 * on each release.
 */

Record({
  $id: Now.ID['maf_cap_declarative'],
  table: 'x_maf_core_collector_capability',
  data: {
    code: 'declarative',
    label: 'Declarative (MAFDeclarativeCollector)',
    description:
      'Counts, sums, averages, distinct counts and percentages against a source table with an encoded-query filter. Used for ~60% of metrics. No per-metric script.',
    collector_mode: 'declarative',
    script_include: '',
    supported_output_type: 'percentage',
    supports_drilldown: true,
    required_params_schema_json: JSON.stringify({
      source_table: 'string — table to aggregate',
      aggregation: 'enum — sum | avg | count | count_distinct | percentage',
    }),
    optional_params_schema_json: JSON.stringify({
      filter_condition: 'string — encoded query',
      aggregation_field: 'string — required for sum/avg/count_distinct',
      denominator_filter: 'string — required when aggregation=percentage',
    }),
    sample_response_json: JSON.stringify({
      value: 87.4,
      drillDownTable: 'incident',
      drillDownQuery: 'active=true^categoryISNOTEMPTY',
      error: null,
    }),
    failure_modes:
      'Invalid source_table or encoded query; percentage with empty denominator; access-control errors when source table is out of scope.',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cap_duration'],
  table: 'x_maf_core_collector_capability',
  data: {
    code: 'duration',
    label: 'Duration (MAFDurationCollector)',
    description:
      'Computes time spans between two datetime fields across a rolling window, with configurable unit and aggregation (avg / median / p90 / p95 / min / max / count).',
    collector_mode: 'script_include',
    script_include: 'MAFDurationCollector',
    supported_output_type: 'duration',
    supports_drilldown: true,
    required_params_schema_json: JSON.stringify({
      table: 'string',
      start_field: 'string — datetime column',
      end_field: 'string — datetime column',
      unit: 'enum — minutes | hours | days',
      aggregation: 'enum — avg | min | max | count | median | p90 | p95',
    }),
    optional_params_schema_json: JSON.stringify({
      filter: 'string — encoded query',
      window_field: 'string — datetime column used for windowing',
      window_days: 'integer',
    }),
    sample_response_json: JSON.stringify({
      value: 4.6,
      drillDownTable: 'incident',
      drillDownQuery: 'stateIN6,7^resolved_at>=javascript:gs.daysAgoStart(30)',
      error: null,
    }),
    failure_modes:
      'Records where end_field < start_field produce negative values and are excluded; empty windows return value=0; missing start_field/end_field columns raise error.',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cap_windowed_ratio'],
  table: 'x_maf_core_collector_capability',
  data: {
    code: 'windowed_ratio',
    label: 'Windowed ratio (MAFWindowedRatioCollector)',
    description:
      'Ratio of numerator filter over denominator filter within a rolling window on a single table. Returns a percentage.',
    collector_mode: 'script_include',
    script_include: 'MAFWindowedRatioCollector',
    supported_output_type: 'percentage',
    supports_drilldown: true,
    required_params_schema_json: JSON.stringify({
      table: 'string',
      numerator_filter: 'string — encoded query',
      denominator_filter: 'string — encoded query',
    }),
    optional_params_schema_json: JSON.stringify({
      window_field: 'string — datetime column',
      window_days: 'integer',
      empty_denominator_value: 'number — returned when denominator count is 0',
    }),
    sample_response_json: JSON.stringify({
      value: 3.1,
      drillDownTable: 'incident',
      drillDownQuery: 'stateIN6,7^reopen_count>0',
      error: null,
    }),
    failure_modes:
      'Empty denominator without empty_denominator_value raises error; overlapping filters silently produce >100% values.',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cap_cross_table_ratio'],
  table: 'x_maf_core_collector_capability',
  data: {
    code: 'cross_table_ratio',
    label: 'Cross-table ratio (MAFCrossTableRatioCollector)',
    description:
      'Ratio between counts on two different tables. Supports distinct counts and portal-catalog scope. Used for adoption and coverage metrics.',
    collector_mode: 'script_include',
    script_include: 'MAFCrossTableRatioCollector',
    supported_output_type: 'percentage',
    supports_drilldown: true,
    required_params_schema_json: JSON.stringify({
      numerator_table: 'string',
      numerator_filter: 'string — encoded query',
      denominator_table: 'string',
      denominator_filter: 'string — encoded query',
    }),
    optional_params_schema_json: JSON.stringify({
      numerator_distinct_field: 'string',
      denominator_distinct_field: 'string',
      empty_denominator_value: 'number',
      portal_catalog_scope: 'boolean',
    }),
    sample_response_json: JSON.stringify({
      value: 42,
      drillDownTable: 'sc_cat_item',
      drillDownQuery: 'active=true^flow_designer_flowISNOTEMPTY',
      error: null,
    }),
    failure_modes:
      'portal_catalog_scope requires MAFPortalScopeHelper; either table inaccessible; distinct field on non-existent column.',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cap_grouped_average'],
  table: 'x_maf_core_collector_capability',
  data: {
    code: 'grouped_average',
    label: 'Grouped average (MAFGroupedAverageCollector)',
    description:
      'Computes an average-of-averages by grouping rows on a field then averaging group counts — used for "average items per catalog" style metrics.',
    collector_mode: 'script_include',
    script_include: 'MAFGroupedAverageCollector',
    supported_output_type: 'count',
    supports_drilldown: true,
    required_params_schema_json: JSON.stringify({
      table: 'string',
      group_by: 'string — field to group on',
    }),
    optional_params_schema_json: JSON.stringify({
      filter: 'string — encoded query',
      empty_group_value: 'number',
    }),
    sample_response_json: JSON.stringify({
      value: 18.3,
      drillDownTable: 'sc_cat_item',
      drillDownQuery: 'active=true',
      error: null,
    }),
    failure_modes:
      'Skewed group sizes produce misleading averages; group_by on a reference field needs the .sys_id suffix.',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cap_schema_introspection'],
  table: 'x_maf_core_collector_capability',
  data: {
    code: 'schema_introspection',
    label: 'Schema introspection (MAFSchemaIntrospectionCollector)',
    description:
      'Queries platform-health tables (sys_trigger, sys_script, sysevent_email_action, sys_security_acl, syslog, etc.) for counts, collisions and windowed counts against an allowlist.',
    collector_mode: 'script_include',
    script_include: 'MAFSchemaIntrospectionCollector',
    supported_output_type: 'count',
    supports_drilldown: true,
    required_params_schema_json: JSON.stringify({
      table: 'string — must be in allowlist',
      mode: 'enum — count | group_collision | row_count_over_threshold | windowed_count',
    }),
    optional_params_schema_json: JSON.stringify({
      filter: 'string',
      group_by: 'string',
      threshold: 'number',
      window_field: 'string',
      window_days: 'integer',
    }),
    sample_response_json: JSON.stringify({
      value: 17,
      drillDownTable: 'sys_trigger',
      drillDownQuery: 'last_run_duration>3600000',
      error: null,
    }),
    failure_modes:
      'Table outside allowlist returns error without executing; group_collision with no group_by returns 0; windowed_count on non-datetime window_field errors.',
    active: true,
  },
})

Record({
  $id: Now.ID['maf_cap_manual'],
  table: 'x_maf_core_collector_capability',
  data: {
    code: 'manual',
    label: 'Manual (consultant input)',
    description:
      'Metric value is supplied by a consultant during an assessment. Result is created with rag_status=pending_input during the run; a business rule scores it once a raw_value is entered. Used for governance / process questions that cannot be measured from instance data.',
    collector_mode: 'manual',
    script_include: '',
    supported_output_type: 'score',
    supports_drilldown: false,
    required_params_schema_json: '',
    optional_params_schema_json: JSON.stringify({
      manual_guidance_text: 'string — shown to the consultant during entry',
    }),
    sample_response_json: JSON.stringify({
      raw_value: 1,
      manual_response_notes: 'Confirmed by Platform Lead on 2026-04-10',
      manual_evidence: 'Link to governance charter document',
    }),
    failure_modes:
      'Metric never answered → stays pending_input and is excluded from category weight denominator; answered value outside threshold range still scores but may look odd on the dashboard.',
    active: true,
  },
})
