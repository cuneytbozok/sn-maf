import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['9fc231e41593484fb310cd2ab9471c1f'],
    type: 'record',
    operation: 'delete',
    roles: ['x_maf_core.admin'],
    table: 'x_maf_core_sub_category',
})
