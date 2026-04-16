import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafProductionCloneSafetyCollector = ScriptInclude({
    $id: Now.ID['e6ce3dc05d8b4543972647b798d4a53f'],
    name: 'MAFProductionCloneSafetyCollector',
    description: 'Production clone target safety (sn_SE10087); configurable property names.',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFProductionCloneSafetyCollector.server.js'),
    apiName: 'x_maf_core.MAFProductionCloneSafetyCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
