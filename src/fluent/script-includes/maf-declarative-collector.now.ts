import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafDeclarativeCollector = ScriptInclude({
    $id: Now.ID['maf_si_declarative_collector'],
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
