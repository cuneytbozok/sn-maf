import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['cfaeb529311e48708f23f96fb3a904ad'],
    name: 'MAFDurationCollector',
    script: Now.include('./sys_script_include_cfaeb529311e48708f23f96fb3a904ad.server.js'),
    description:
        'Reusable duration stats (avg/median/p90/p95/max/min/count) over any table; v1 units: minutes, hours, days.',
    apiName: 'x_maf_core.MAFDurationCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
