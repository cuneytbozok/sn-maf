import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafAssessmentRunner = ScriptInclude({
    $id: Now.ID['2e543e5493c948c9b67893ecea62ba86'],
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
