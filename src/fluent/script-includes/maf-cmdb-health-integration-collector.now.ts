import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafCmdbHealthIntegrationCollector = ScriptInclude({
    $id: Now.ID['a1b2c3d4e5f6478990a1b2c3d4e5f60a'],
    name: 'MAFCmdbHealthIntegrationCollector',
    description: 'CMDB Health plugin presence and optional property.',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFCmdbHealthIntegrationCollector.server.js'),
    apiName: 'x_maf_core.MAFCmdbHealthIntegrationCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
