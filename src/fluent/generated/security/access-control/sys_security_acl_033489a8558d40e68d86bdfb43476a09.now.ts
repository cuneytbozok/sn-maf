import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['033489a8558d40e68d86bdfb43476a09'],
    type: 'record',
    operation: 'read',
    roles: ['x_maf_core.viewer', 'x_maf_core.admin', 'x_maf_core.user'],
    table: 'x_maf_core_collector_eval',
})
