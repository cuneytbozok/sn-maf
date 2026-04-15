import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafScoringEngine = ScriptInclude({
    $id: Now.ID['6db02345e7f8679012a3b4c5d6e7f809'],
    name: 'MAFScoringEngine',
    description: 'Normalizes metric values and rolls up sub-category then category scores for MAF (PRD §4.3, §6.4).',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFScoringEngine.server.js'),
    apiName: 'x_maf_core.MAFScoringEngine',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
