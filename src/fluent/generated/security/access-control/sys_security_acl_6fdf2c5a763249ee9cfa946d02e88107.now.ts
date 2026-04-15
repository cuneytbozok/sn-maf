import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['6fdf2c5a763249ee9cfa946d02e88107'],
    type: 'record',
    operation: 'write',
    roles: ['x_maf_core.admin'],
    table: 'x_maf_core_assessment_run',
})
