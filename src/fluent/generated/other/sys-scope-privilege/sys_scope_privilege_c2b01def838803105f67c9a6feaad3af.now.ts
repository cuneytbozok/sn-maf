import { CrossScopePrivilege } from '@servicenow/sdk/core'

CrossScopePrivilege({
    $id: Now.ID['c2b01def838803105f67c9a6feaad3af'],
    operation: 'read',
    status: 'allowed',
    targetName: 'sys_security_acl_role',
    targetScope: 'global',
    targetType: 'sys_db_object',
})
