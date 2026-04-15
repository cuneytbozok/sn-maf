import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['2e543e5493c948c9b67893ecea62ba86'],
    name: 'MAFAssessmentRunner',
    script: Now.include('./sys_script_include_2e543e5493c948c9b67893ecea62ba86.server.js'),
    description: 'Orchestrates MAF assessment runs (sync + GlideScriptedProgressWorker), PRD §6.3.',
    apiName: 'x_maf_core.MAFAssessmentRunner',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
