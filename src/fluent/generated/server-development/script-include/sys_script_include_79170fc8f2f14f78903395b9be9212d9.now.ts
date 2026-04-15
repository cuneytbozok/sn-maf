import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['79170fc8f2f14f78903395b9be9212d9'],
    name: 'MAFGroupedAverageCollector',
    script: Now.include('./sys_script_include_79170fc8f2f14f78903395b9be9212d9.server.js'),
    description: 'Average (or median/p90/max/min) of child counts per parent with optional zero-fill (PRD §5.3).',
    apiName: 'x_maf_core.MAFGroupedAverageCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
