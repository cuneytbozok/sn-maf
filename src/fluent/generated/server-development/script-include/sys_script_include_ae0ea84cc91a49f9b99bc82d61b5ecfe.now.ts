import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['ae0ea84cc91a49f9b99bc82d61b5ecfe'],
    name: 'ITSMRecurringProblemLinkCollector',
    script: Now.include('./sys_script_include_ae0ea84cc91a49f9b99bc82d61b5ecfe.server.js'),
    description: 'ITSM pack: recurring incidents linked to problems (PRD §10).',
    apiName: 'x_maf_core.ITSMRecurringProblemLinkCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
