import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['f5b2cdfc1d6140a7b443b8678f19a0fb'],
    type: 'record',
    operation: 'read',
    roles: ['x_maf_core.viewer', 'x_maf_core.user', 'x_maf_core.admin'],
    table: 'x_maf_core_sub_category_score',
})
