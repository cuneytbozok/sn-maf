import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['b8227533e2604315a6f9e1626d867828'],
    type: 'record',
    operation: 'write',
    roles: ['x_maf_core.admin'],
    table: 'x_maf_core_metric_definition',
})
