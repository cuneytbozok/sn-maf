import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafChangeScheduleAdherenceCollector = ScriptInclude({
    $id: Now.ID['7691f1bb834c83105f67c9a6feaad3fd'],
    name: 'MAFChangeScheduleAdherenceCollector',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFChangeScheduleAdherenceCollector.server.js'),
    apiName: 'x_maf_core.MAFChangeScheduleAdherenceCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
