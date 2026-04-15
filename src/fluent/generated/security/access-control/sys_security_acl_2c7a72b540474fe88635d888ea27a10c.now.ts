import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['2c7a72b540474fe88635d888ea27a10c'],
    type: 'record',
    operation: 'create',
    roles: ['x_maf_core.admin'],
    table: 'x_maf_core_collector_eval',
})
