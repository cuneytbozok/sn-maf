import '@servicenow/sdk/global'
import { UiPolicy } from '@servicenow/sdk/core'

/**
 * Metric Result form behavior for manual metrics.
 *
 * We key on the result_mode field (set at insert time by
 * MAFAssessmentRunner._collectOneMetric) instead of dot-walking to
 * metric_definition.collector_type — dot-walk conditions on UI policies are
 * unreliable, and the mirrored field keeps the condition evaluation cheap
 * client-side.
 *
 * For a manual result: hide the auto-collector artifacts (drill-down query,
 * collection error), and surface the consultant's input fields. raw_value and
 * the manual_* note/evidence fields become writable; normalized_score +
 * rag_status stay read-only because the rescore business rule fills them.
 */
UiPolicy({
    $id: Now.ID['maf_uip_metric_result_manual'],
    table: 'x_maf_core_metric_result',
    shortDescription: 'MAF — Manual metric result field visibility',
    conditions: 'result_mode=manual',
    onLoad: true,
    reverseIfFalse: true,
    active: true,
    order: 100,
    actions: [
        // Hide fields that only make sense for auto-collected results.
        { field: 'drill_down_table', visible: false, mandatory: 'ignore', readOnly: 'ignore' },
        { field: 'drill_down_query', visible: false, mandatory: 'ignore', readOnly: 'ignore' },
        { field: 'collection_error', visible: false, mandatory: 'ignore', readOnly: 'ignore' },
        // Let the consultant enter a value and capture notes / evidence.
        { field: 'raw_value', visible: true, readOnly: false, mandatory: 'ignore' },
        { field: 'manual_response_notes', visible: true, readOnly: false, mandatory: 'ignore' },
        { field: 'manual_evidence', visible: true, readOnly: false, mandatory: 'ignore' },
        // Audit + derived outputs stay visible but system-maintained.
        { field: 'manual_answered_by', visible: true, readOnly: true, mandatory: 'ignore' },
        { field: 'manual_answered_at', visible: true, readOnly: true, mandatory: 'ignore' },
        { field: 'normalized_score', visible: true, readOnly: true, mandatory: 'ignore' },
        { field: 'rag_status', visible: true, readOnly: true, mandatory: 'ignore' },
    ],
})
