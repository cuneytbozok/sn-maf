import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['6db02345e7f8679012a3b4c5d6e7f809'],
    name: 'MAFScoringEngine',
    script: Now.include('./sys_script_include_6db02345e7f8679012a3b4c5d6e7f809.server.js'),
    description: 'Normalizes metric values and rolls up sub-category then category scores for MAF (PRD §4.3, §6.4).',
    apiName: 'x_maf_core.MAFScoringEngine',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
