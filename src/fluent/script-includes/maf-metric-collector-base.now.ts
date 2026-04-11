import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafMetricCollectorBase = ScriptInclude({
    $id: Now.ID['maf_si_collector_base'],
    name: 'MAFMetricCollectorBase',
    description: 'Abstract base for MAF metric collectors (PRD §6.1).',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFMetricCollectorBase.server.js'),
    apiName: 'x_maf_core.MAFMetricCollectorBase',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
