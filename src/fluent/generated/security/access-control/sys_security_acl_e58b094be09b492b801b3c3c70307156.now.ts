import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['e58b094be09b492b801b3c3c70307156'],
    type: 'record',
    operation: 'read',
    roles: ['x_maf_core.admin', 'x_maf_core.user', 'x_maf_core.viewer'],
    table: 'x_maf_core_sub_category',
})
