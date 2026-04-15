import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const itsmMttrCollector = ScriptInclude({
    $id: Now.ID['2de7a75daf8f4292b9bf79ee6aa876a8'],
    name: 'ITSMMTTRCollector',
    description: 'ITSM pack: mean time to resolve in hours (PRD §10).',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/ITSMMTTRCollector.server.js'),
    apiName: 'x_maf_core.ITSMMTTRCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
