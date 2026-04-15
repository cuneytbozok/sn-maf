import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['adce3215bdd142569d7fa3636e61a179'],
    type: 'record',
    operation: 'write',
    roles: ['x_maf_core.admin'],
    table: 'x_maf_core_metric_result',
})
