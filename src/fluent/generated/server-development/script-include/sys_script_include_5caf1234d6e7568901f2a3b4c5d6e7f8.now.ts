import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['5caf1234d6e7568901f2a3b4c5d6e7f8'],
    name: 'MAFCollectorFactory',
    script: Now.include('./sys_script_include_5caf1234d6e7568901f2a3b4c5d6e7f8.server.js'),
    description: 'Resolves scoped Script Include collector classes for MAF (PRD §6.1).',
    apiName: 'x_maf_core.MAFCollectorFactory',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
