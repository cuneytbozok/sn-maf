import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['3a8f9012b4c3456789d0e1f2a3b4c5d6'],
    name: 'MAFMetricCollectorBase',
    script: Now.include('./sys_script_include_3a8f9012b4c3456789d0e1f2a3b4c5d6.server.js'),
    description: 'Abstract base for MAF metric collectors (PRD §6.1).',
    apiName: 'x_maf_core.MAFMetricCollectorBase',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
