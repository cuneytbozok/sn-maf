import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['4a3b4841ccba418abbbca0825c8c7e30'],
    type: 'record',
    operation: 'read',
    roles: ['x_maf_core.user', 'x_maf_core.admin', 'x_maf_core.viewer'],
    table: 'x_maf_core_metric_result',
})
