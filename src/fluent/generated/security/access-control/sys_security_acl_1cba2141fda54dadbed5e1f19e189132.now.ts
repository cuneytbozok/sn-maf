import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['1cba2141fda54dadbed5e1f19e189132'],
    type: 'record',
    operation: 'read',
    roles: ['x_maf_core.admin', 'x_maf_core.viewer', 'x_maf_core.user'],
    table: 'x_maf_core_ai_summary',
})
