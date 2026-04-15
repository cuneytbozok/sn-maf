import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['cad2cde79ab240bba8542f95ab8fc193'],
    type: 'record',
    operation: 'read',
    roles: ['x_maf_core.viewer', 'x_maf_core.user', 'x_maf_core.admin'],
    table: 'x_maf_core_pack',
})
