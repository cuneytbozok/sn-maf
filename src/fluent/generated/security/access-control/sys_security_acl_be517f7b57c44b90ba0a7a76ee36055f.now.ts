import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['be517f7b57c44b90ba0a7a76ee36055f'],
    type: 'record',
    operation: 'delete',
    roles: ['x_maf_core.admin'],
    table: 'x_maf_core_assessment_run',
})
