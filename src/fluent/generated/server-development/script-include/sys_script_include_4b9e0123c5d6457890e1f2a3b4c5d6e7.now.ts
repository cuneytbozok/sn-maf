import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['4b9e0123c5d6457890e1f2a3b4c5d6e7'],
    name: 'MAFDeclarativeCollector',
    script: Now.include('./sys_script_include_4b9e0123c5d6457890e1f2a3b4c5d6e7.server.js'),
    description: 'Declarative GlideAggregate collector for MAF (PRD §6.2).',
    apiName: 'x_maf_core.MAFDeclarativeCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
