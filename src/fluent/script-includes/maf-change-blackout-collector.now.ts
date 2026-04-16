import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafChangeBlackoutCollector = ScriptInclude({
    $id: Now.ID['6c492953283c472881f18e62c4da0f8f'],
    name: 'MAFChangeBlackoutCollector',
    description: 'Active change blackout / schedule rows (sn_SE10308); table list via script_params.',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFChangeBlackoutCollector.server.js'),
    apiName: 'x_maf_core.MAFChangeBlackoutCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
