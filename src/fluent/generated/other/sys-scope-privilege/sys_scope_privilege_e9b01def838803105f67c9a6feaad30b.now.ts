import { CrossScopePrivilege } from '@servicenow/sdk/core'

CrossScopePrivilege({
    $id: Now.ID['e9b01def838803105f67c9a6feaad30b'],
    operation: 'read',
    status: 'allowed',
    targetName: 'sysapproval_approver',
    targetScope: 'global',
    targetType: 'sys_db_object',
})
