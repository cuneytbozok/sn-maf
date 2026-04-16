import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafCmdbAvgRelPerCiCollector = ScriptInclude({
    $id: Now.ID['a1b2c3d4e5f6478990a1b2c3d4e5f601'],
    name: 'MAFCmdbAvgRelPerCiCollector',
    description: 'Average cmdb_rel_ci edges per cmdb_ci row.',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFCmdbAvgRelPerCiCollector.server.js'),
    apiName: 'x_maf_core.MAFCmdbAvgRelPerCiCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
