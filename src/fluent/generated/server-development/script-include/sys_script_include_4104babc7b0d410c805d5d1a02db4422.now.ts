import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['4104babc7b0d410c805d5d1a02db4422'],
    name: 'MAFCrossTableRatioCollector',
    script: Now.include('./sys_script_include_4104babc7b0d410c805d5d1a02db4422.server.js'),
    description:
        'Cross-table COUNT ratio × 100; optional distinct counts via numerator/denominator_distinct_field (PRD §5.2).',
    apiName: 'x_maf_core.MAFCrossTableRatioCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
