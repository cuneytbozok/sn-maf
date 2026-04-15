import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafDeclarativeCollector = ScriptInclude({
    $id: Now.ID['4b9e0123c5d6457890e1f2a3b4c5d6e7'],
    name: 'MAFDeclarativeCollector',
    description: 'Declarative GlideAggregate collector for MAF (PRD §6.2).',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFDeclarativeCollector.server.js'),
    apiName: 'x_maf_core.MAFDeclarativeCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
