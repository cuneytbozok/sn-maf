import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafOobChoiceComplianceCollector = ScriptInclude({
    $id: Now.ID['2b517d7383cc83105f67c9a6feaad32b'],
    name: 'MAFOOBChoiceComplianceCollector',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFOOBChoiceComplianceCollector.server.js'),
    apiName: 'x_maf_core.MAFOOBChoiceComplianceCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
