import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafDiscoveryLastRunAgeCollector = ScriptInclude({
    $id: Now.ID['a1b2c3d4e5f6478990a1b2c3d4e5f608'],
    name: 'MAFDiscoveryLastRunAgeCollector',
    description: 'Days since most recent discovery_status row by date field.',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFDiscoveryLastRunAgeCollector.server.js'),
    apiName: 'x_maf_core.MAFDiscoveryLastRunAgeCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
