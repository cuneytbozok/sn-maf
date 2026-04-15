import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['3f7808c9f59e4cf3aa6543d02abb2c3c'],
    type: 'record',
    operation: 'write',
    roles: ['x_maf_core.admin'],
    table: 'x_maf_core_collector_eval',
})
