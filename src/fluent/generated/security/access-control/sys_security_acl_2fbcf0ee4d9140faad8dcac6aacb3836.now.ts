import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['2fbcf0ee4d9140faad8dcac6aacb3836'],
    type: 'record',
    operation: 'read',
    roles: ['x_maf_core.admin', 'x_maf_core.user', 'x_maf_core.viewer'],
    table: 'x_maf_core_metric_definition',
})
