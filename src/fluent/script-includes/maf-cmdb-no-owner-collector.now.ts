import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafCmdbNoOwnerCollector = ScriptInclude({
    $id: Now.ID['a1b2c3d4e5f6478990a1b2c3d4e5f603'],
    name: 'MAFCmdbNoOwnerCollector',
    description: 'CIs with no managed_by and no owned_by.',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFCmdbNoOwnerCollector.server.js'),
    apiName: 'x_maf_core.MAFCmdbNoOwnerCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
