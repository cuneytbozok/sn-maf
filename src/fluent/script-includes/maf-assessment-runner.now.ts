import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafAssessmentRunner = ScriptInclude({
    $id: Now.ID['maf_si_assessment_runner'],
    name: 'MAFAssessmentRunner',
    description: 'Orchestrates MAF assessment runs (sync + GlideScriptedProgressWorker), PRD §6.3.',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFAssessmentRunner.server.js'),
    apiName: 'x_maf_core.MAFAssessmentRunner',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
