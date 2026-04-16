import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafCmdbOrphanRateCollector = ScriptInclude({
    $id: Now.ID['a1b2c3d4e5f6478990a1b2c3d4e5f602'],
    name: 'MAFCmdbOrphanRateCollector',
    description: 'Percentage of CIs with no cmdb_rel_ci references.',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFCmdbOrphanRateCollector.server.js'),
    apiName: 'x_maf_core.MAFCmdbOrphanRateCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
