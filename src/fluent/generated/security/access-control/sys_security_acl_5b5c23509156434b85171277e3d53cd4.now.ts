import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['5b5c23509156434b85171277e3d53cd4'],
    type: 'record',
    operation: 'delete',
    roles: ['x_maf_core.admin'],
    table: 'x_maf_core_category_score',
})
