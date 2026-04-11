import { CrossScopePrivilege } from '@servicenow/sdk/core'

CrossScopePrivilege({
    $id: Now.ID['2bb01def838803105f67c9a6feaad3b3'],
    operation: 'read',
    status: 'allowed',
    targetName: 'sys_security_acl',
    targetScope: 'global',
    targetType: 'sys_db_object',
})
