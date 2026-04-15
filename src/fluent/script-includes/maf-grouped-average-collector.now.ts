import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafGroupedAverageCollector = ScriptInclude({
    $id: Now.ID['79170fc8f2f14f78903395b9be9212d9'],
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
