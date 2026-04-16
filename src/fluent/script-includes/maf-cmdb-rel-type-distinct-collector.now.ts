import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafCmdbRelTypeDistinctCollector = ScriptInclude({
    $id: Now.ID['a1b2c3d4e5f6478990a1b2c3d4e5f605'],
    name: 'MAFCmdbRelTypeDistinctCollector',
    description: 'Distinct cmdb_rel_ci.type values in use.',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFCmdbRelTypeDistinctCollector.server.js'),
    apiName: 'x_maf_core.MAFCmdbRelTypeDistinctCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
