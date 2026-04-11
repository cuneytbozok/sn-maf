import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafDurationCollector = ScriptInclude({
    $id: Now.ID['maf_si_duration_collector'],
    name: 'MAFDurationCollector',
    description:
        'Reusable duration stats (avg/median/p90/p95/max/min/count) over any table; v1 units: minutes, hours, days.',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFDurationCollector.server.js'),
    apiName: 'x_maf_core.MAFDurationCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
