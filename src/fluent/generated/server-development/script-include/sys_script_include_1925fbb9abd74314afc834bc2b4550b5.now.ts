import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['1925fbb9abd74314afc834bc2b4550b5'],
    name: 'ITSMReopenRateCollector',
    script: Now.include('./sys_script_include_1925fbb9abd74314afc834bc2b4550b5.server.js'),
    description: 'ITSM pack: reopen rate % in a sliding window (PRD §10).',
    apiName: 'x_maf_core.ITSMReopenRateCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
