import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

export const mafManualResponseScorer = BusinessRule({
    $id: Now.ID['maf_br_manual_response_scorer'],
    table: 'x_maf_core_metric_result',
    name: 'MAF Manual Response Scorer',
    description:
        'On update of a manual metric result, normalizes the raw_value against the metric definition thresholds, writes the normalized score / RAG status / answered-by audit fields, then refreshes the run rollup.',
    when: 'before',
    action: ['update'],
    filterCondition: 'result_mode=manual^raw_valueCHANGES^raw_valueISNOTEMPTY',
    order: 200,
    active: true,
    script: Now.include('../../server/business-rules/MAFManualResponseScorer.server.js'),
})
