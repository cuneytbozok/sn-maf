import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['2eb1872c12694791992c756cee0ebd9c'],
    type: 'record',
    operation: 'delete',
    roles: ['x_maf_core.admin'],
    table: 'x_maf_core_ai_summary',
})
