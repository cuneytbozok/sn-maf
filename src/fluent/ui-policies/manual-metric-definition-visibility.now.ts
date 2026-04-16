import '@servicenow/sdk/global'
import { UiPolicy } from '@servicenow/sdk/core'

/**
 * Metric Definition form behavior for collector_type = manual.
 *
 * Manual metrics have no collector / filter / aggregation / script — those
 * fields exist to configure declarative or script_include collectors. When a
 * pack author switches collector_type to 'manual', we hide that set and
 * surface manual_guidance_text instead. reverseIfFalse:true means switching
 * back to declarative / script_include automatically restores visibility.
 */
UiPolicy({
    $id: Now.ID['maf_uip_metric_definition_manual'],
    table: 'x_maf_core_metric_definition',
    shortDescription: 'MAF — Manual metric definition field visibility',
    conditions: 'collector_type=manual',
    onLoad: true,
    reverseIfFalse: true,
    active: true,
    order: 100,
    actions: [
        // Hide collector-configuration fields that are meaningless for manual metrics.
        { field: 'source_table', visible: false, mandatory: false, readOnly: 'ignore' },
        { field: 'filter_condition', visible: false, mandatory: false, readOnly: 'ignore' },
        { field: 'aggregation', visible: false, mandatory: false, readOnly: 'ignore' },
        { field: 'aggregation_field', visible: false, mandatory: false, readOnly: 'ignore' },
        { field: 'denominator_filter', visible: false, mandatory: false, readOnly: 'ignore' },
        { field: 'script_include', visible: false, mandatory: false, readOnly: 'ignore' },
        { field: 'script_params', visible: false, mandatory: false, readOnly: 'ignore' },
        // Show the consultant-facing guidance field for manual metrics only.
        { field: 'manual_guidance_text', visible: true, mandatory: 'ignore', readOnly: 'ignore' },
    ],
})
