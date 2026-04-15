import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['adc708462a604d778addbd1f4f5c2ab4'],
    name: 'MAFWindowedRatioCollector',
    script: Now.include('./sys_script_include_adc708462a604d778addbd1f4f5c2ab4.server.js'),
    description: 'Windowed COUNT ratio × 100 for numerator/denominator encoded queries (PRD §4.3).',
    apiName: 'x_maf_core.MAFWindowedRatioCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
