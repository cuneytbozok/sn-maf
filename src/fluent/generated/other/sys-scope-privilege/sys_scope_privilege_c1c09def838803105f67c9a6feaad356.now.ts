import { CrossScopePrivilege } from '@servicenow/sdk/core'

CrossScopePrivilege({
    $id: Now.ID['c1c09def838803105f67c9a6feaad356'],
    operation: 'read',
    status: 'allowed',
    targetName: 'sys_audit',
    targetScope: 'global',
    targetType: 'sys_db_object',
})
