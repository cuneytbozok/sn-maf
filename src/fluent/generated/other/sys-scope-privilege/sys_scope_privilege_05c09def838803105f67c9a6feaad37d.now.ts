import { CrossScopePrivilege } from '@servicenow/sdk/core'

CrossScopePrivilege({
    $id: Now.ID['05c09def838803105f67c9a6feaad37d'],
    operation: 'read',
    status: 'allowed',
    targetName: 'sys_transaction_pattern',
    targetScope: 'global',
    targetType: 'sys_db_object',
})
