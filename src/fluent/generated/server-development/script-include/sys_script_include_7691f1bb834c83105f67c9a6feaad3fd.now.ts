import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['7691f1bb834c83105f67c9a6feaad3fd'],
    name: 'MAFChangeScheduleAdherenceCollector',
    script: Now.include('./sys_script_include_7691f1bb834c83105f67c9a6feaad3fd.server.js'),
    apiName: 'x_maf_core.MAFChangeScheduleAdherenceCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
