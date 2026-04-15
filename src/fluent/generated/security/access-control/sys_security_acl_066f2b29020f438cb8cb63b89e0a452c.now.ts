import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['066f2b29020f438cb8cb63b89e0a452c'],
    type: 'record',
    operation: 'read',
    roles: ['x_maf_core.viewer', 'x_maf_core.user', 'x_maf_core.admin'],
    table: 'x_maf_core_assessment_run',
})
