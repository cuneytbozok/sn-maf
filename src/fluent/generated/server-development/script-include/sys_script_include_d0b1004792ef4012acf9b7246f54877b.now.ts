import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['d0b1004792ef4012acf9b7246f54877b'],
    name: 'MAFAISummaryProvider',
    script: Now.include('./sys_script_include_d0b1004792ef4012acf9b7246f54877b.server.js'),
    description: 'Stub / Now Assist / REST LLM AI summary for MAF runs (PRD §6.5).',
    apiName: 'x_maf_core.MAFAISummaryProvider',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
