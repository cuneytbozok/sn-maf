import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafCmdbDuplicateRateCollector = ScriptInclude({
    $id: Now.ID['a1b2c3d4e5f6478990a1b2c3d4e5f604'],
    name: 'MAFCmdbDuplicateRateCollector',
    description: 'Heuristic duplicate rate by name+class+serial_number.',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFCmdbDuplicateRateCollector.server.js'),
    apiName: 'x_maf_core.MAFCmdbDuplicateRateCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
