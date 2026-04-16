import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafSecurityManagerDenyCollector = ScriptInclude({
    $id: Now.ID['10950e8353854618989b226f5a1c858c'],
    name: 'MAFSecurityManagerDenyCollector',
    description: 'Security Manager default mode should be deny (Scan Engine sn_SE10085).',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFSecurityManagerDenyCollector.server.js'),
    apiName: 'x_maf_core.MAFSecurityManagerDenyCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
