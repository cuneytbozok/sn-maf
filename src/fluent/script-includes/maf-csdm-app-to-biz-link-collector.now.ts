import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafCsdmAppToBizLinkCollector = ScriptInclude({
    $id: Now.ID['a1b2c3d4e5f6478990a1b2c3d4e5f606'],
    name: 'MAFCsdmAppToBizLinkCollector',
    description: 'Application CIs with at least one cmdb_rel_ci as child.',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFCsdmAppToBizLinkCollector.server.js'),
    apiName: 'x_maf_core.MAFCsdmAppToBizLinkCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
