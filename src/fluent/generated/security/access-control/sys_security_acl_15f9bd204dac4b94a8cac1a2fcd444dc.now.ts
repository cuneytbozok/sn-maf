import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['15f9bd204dac4b94a8cac1a2fcd444dc'],
    type: 'record',
    operation: 'read',
    roles: ['x_maf_core.admin', 'x_maf_core.user', 'x_maf_core.viewer'],
    table: 'x_maf_core_category_score',
})
