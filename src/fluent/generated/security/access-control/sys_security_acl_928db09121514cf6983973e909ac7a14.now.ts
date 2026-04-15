import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['928db09121514cf6983973e909ac7a14'],
    type: 'record',
    operation: 'read',
    roles: ['x_maf_core.user', 'x_maf_core.viewer', 'x_maf_core.admin'],
    table: 'x_maf_core_category',
})
