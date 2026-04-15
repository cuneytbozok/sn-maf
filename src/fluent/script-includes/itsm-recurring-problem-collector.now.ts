import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const itsmRecurringProblemCollector = ScriptInclude({
    $id: Now.ID['ae0ea84cc91a49f9b99bc82d61b5ecfe'],
    name: 'ITSMRecurringProblemLinkCollector',
    description: 'ITSM pack: recurring incidents linked to problems (PRD §10).',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/ITSMRecurringProblemLinkCollector.server.js'),
    apiName: 'x_maf_core.ITSMRecurringProblemLinkCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
