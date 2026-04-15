import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafWindowedRatioCollector = ScriptInclude({
    $id: Now.ID['adc708462a604d778addbd1f4f5c2ab4'],
    name: 'MAFWindowedRatioCollector',
    description: 'Windowed COUNT ratio × 100 for numerator/denominator encoded queries (PRD §4.3).',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFWindowedRatioCollector.server.js'),
    apiName: 'x_maf_core.MAFWindowedRatioCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
