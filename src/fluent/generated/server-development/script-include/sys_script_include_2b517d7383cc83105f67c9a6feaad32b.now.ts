import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['2b517d7383cc83105f67c9a6feaad32b'],
    name: 'MAFOOBChoiceComplianceCollector',
    script: Now.include('./sys_script_include_2b517d7383cc83105f67c9a6feaad32b.server.js'),
    apiName: 'x_maf_core.MAFOOBChoiceComplianceCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
