import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['8c98ab44e2ce47eab440f127710cec72'],
    type: 'record',
    operation: 'write',
    roles: ['x_maf_core.admin'],
    table: 'x_maf_core_pack',
})
