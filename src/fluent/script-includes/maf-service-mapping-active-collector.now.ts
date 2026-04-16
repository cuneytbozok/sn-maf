import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafServiceMappingActiveCollector = ScriptInclude({
    $id: Now.ID['a1b2c3d4e5f6478990a1b2c3d4e5f609'],
    name: 'MAFServiceMappingActiveCollector',
    description: 'Service mapping pattern row count; optional plugin gate.',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFServiceMappingActiveCollector.server.js'),
    apiName: 'x_maf_core.MAFServiceMappingActiveCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
