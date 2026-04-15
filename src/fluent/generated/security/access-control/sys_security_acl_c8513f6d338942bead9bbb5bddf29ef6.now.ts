import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['c8513f6d338942bead9bbb5bddf29ef6'],
    type: 'record',
    operation: 'write',
    roles: ['x_maf_core.admin'],
    table: 'x_maf_core_ai_summary',
})
