import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

export const mafMetricWeightValidator = BusinessRule({
    $id: Now.ID['maf_br_metric_weight_validator'],
    table: 'x_maf_core_metric_definition',
    name: 'MAF Metric Weight Validator',
    description:
        'Calculates the metric weight sum for the affected category or sub-category after a metric is created, updated, or deleted. Warns the user if the sum deviates from 1.0.',
    when: 'after',
    action: ['update', 'delete', 'insert'],
    order: 200,
    active: true,
    script: Now.include('../../server/business-rules/MAFMetricWeightValidator.server.js'),
})
