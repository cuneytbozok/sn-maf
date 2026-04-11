import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const itsmReopenRateCollector = ScriptInclude({
    $id: Now.ID['maf_si_itsm_reopen_rate'],
    name: 'ITSMReopenRateCollector',
    description: 'ITSM pack: reopen rate % in a sliding window (PRD §10).',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/ITSMReopenRateCollector.server.js'),
    apiName: 'x_maf_core.ITSMReopenRateCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
