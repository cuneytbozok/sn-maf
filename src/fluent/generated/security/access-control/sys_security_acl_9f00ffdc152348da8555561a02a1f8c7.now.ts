import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['9f00ffdc152348da8555561a02a1f8c7'],
    type: 'record',
    operation: 'write',
    roles: ['x_maf_core.admin'],
    table: 'x_maf_core_sub_category',
})
