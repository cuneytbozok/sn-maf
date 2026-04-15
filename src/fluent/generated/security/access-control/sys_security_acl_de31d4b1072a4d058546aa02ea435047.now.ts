import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['de31d4b1072a4d058546aa02ea435047'],
    type: 'record',
    operation: 'write',
    roles: ['x_maf_core.admin'],
    table: 'x_maf_core_sub_category_score',
})
