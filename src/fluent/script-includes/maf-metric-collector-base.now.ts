import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafMetricCollectorBase = ScriptInclude({
    $id: Now.ID['3a8f9012b4c3456789d0e1f2a3b4c5d6'],
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
