import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafCiServiceMappingRateCollector = ScriptInclude({
    $id: Now.ID['a1b2c3d4e5f6478990a1b2c3d4e5f607'],
    name: 'MAFCiServiceMappingRateCollector',
    description: 'CIs appearing in svc_ci_assoc or Depends-on cmdb_rel_ci.',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFCiServiceMappingRateCollector.server.js'),
    apiName: 'x_maf_core.MAFCiServiceMappingRateCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
