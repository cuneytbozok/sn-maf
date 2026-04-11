import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafCrossTableRatioCollector = ScriptInclude({
    $id: Now.ID['maf_si_cross_table_ratio_collector'],
    name: 'MAFCrossTableRatioCollector',
    description:
        'Cross-table COUNT ratio × 100; optional distinct counts via numerator/denominator_distinct_field (PRD §5.2).',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFCrossTableRatioCollector.server.js'),
    apiName: 'x_maf_core.MAFCrossTableRatioCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
