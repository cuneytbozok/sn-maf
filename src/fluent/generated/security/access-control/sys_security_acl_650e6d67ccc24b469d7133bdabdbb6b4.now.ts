import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['650e6d67ccc24b469d7133bdabdbb6b4'],
    type: 'record',
    operation: 'create',
    roles: ['x_maf_core.user', 'x_maf_core.admin'],
    table: 'x_maf_core_assessment_run',
})
