import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['92d7a1cd71c04de99afcb1dc826a750f'],
    type: 'record',
    operation: 'delete',
    roles: ['x_maf_core.admin'],
    table: 'x_maf_core_metric_result',
})
