import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['b84c78134427477cb08b8c32c26984d6'],
    type: 'record',
    operation: 'delete',
    roles: ['x_maf_core.admin'],
    table: 'x_maf_core_metric_definition',
})
