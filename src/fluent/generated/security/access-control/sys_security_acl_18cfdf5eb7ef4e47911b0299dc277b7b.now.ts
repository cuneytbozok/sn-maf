import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['18cfdf5eb7ef4e47911b0299dc277b7b'],
    type: 'record',
    operation: 'delete',
    roles: ['x_maf_core.admin'],
    table: 'x_maf_core_collector_eval',
})
