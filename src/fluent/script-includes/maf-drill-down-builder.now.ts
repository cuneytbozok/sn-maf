import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafDrillDownBuilder = ScriptInclude({
    $id: Now.ID['maf_si_drill_down_builder'],
    name: 'MAFDrillDownBuilder',
    description: 'Builds global table list URLs for metric drill-down (PRD §13.2).',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFDrillDownBuilder.server.js'),
    apiName: 'x_maf_core.MAFDrillDownBuilder',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
