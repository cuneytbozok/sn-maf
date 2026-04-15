import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['2de7a75daf8f4292b9bf79ee6aa876a8'],
    name: 'ITSMMTTRCollector',
    script: Now.include('./sys_script_include_2de7a75daf8f4292b9bf79ee6aa876a8.server.js'),
    description: 'ITSM pack: mean time to resolve in hours (PRD §10).',
    apiName: 'x_maf_core.ITSMMTTRCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
