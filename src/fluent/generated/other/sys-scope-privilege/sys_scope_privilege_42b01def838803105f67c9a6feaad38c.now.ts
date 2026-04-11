import { CrossScopePrivilege } from '@servicenow/sdk/core'

CrossScopePrivilege({
    $id: Now.ID['42b01def838803105f67c9a6feaad38c'],
    operation: 'read',
    status: 'allowed',
    targetName: 'ecc_agent',
    targetScope: 'global',
    targetType: 'sys_db_object',
})
