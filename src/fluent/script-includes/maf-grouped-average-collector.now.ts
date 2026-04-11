import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafGroupedAverageCollector = ScriptInclude({
    $id: Now.ID['maf_si_grouped_average_collector'],
    name: 'MAFGroupedAverageCollector',
    description: 'Average (or median/p90/max/min) of child counts per parent with optional zero-fill (PRD §5.3).',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFGroupedAverageCollector.server.js'),
    apiName: 'x_maf_core.MAFGroupedAverageCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
