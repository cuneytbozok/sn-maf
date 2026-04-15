import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['e803d0901a5a450e8fd253a516ac1c25'],
    type: 'record',
    operation: 'delete',
    roles: ['x_maf_core.admin'],
    table: 'x_maf_core_pack',
})
