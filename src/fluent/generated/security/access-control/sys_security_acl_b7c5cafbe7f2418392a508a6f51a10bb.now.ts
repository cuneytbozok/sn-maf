import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['b7c5cafbe7f2418392a508a6f51a10bb'],
    type: 'record',
    operation: 'write',
    roles: ['x_maf_core.admin'],
    table: 'x_maf_core_category',
})
