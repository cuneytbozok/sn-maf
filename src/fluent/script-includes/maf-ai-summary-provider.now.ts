import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafAiSummaryProvider = ScriptInclude({
    $id: Now.ID['maf_si_ai_summary_provider'],
    name: 'MAFAISummaryProvider',
    description: 'Stub / Now Assist / REST LLM AI summary for MAF runs (PRD §6.5).',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFAISummaryProvider.server.js'),
    apiName: 'x_maf_core.MAFAISummaryProvider',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
