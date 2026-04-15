import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['3d128bccd5474991a1ea15fad473d49f'],
    name: 'MAF Metric Weight Validator',
    table: 'x_maf_core_metric_definition',
    order: 200,
    when: 'after',
    action: ['update', 'delete', 'insert'],
    description:
        'Calculates the metric weight sum for the affected category or sub-category after a metric is created, updated, or deleted. Warns the user if the sum deviates from 1.0.',
    script: Now.include('./sys_script_3d128bccd5474991a1ea15fad473d49f.server.js'),
})
