import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafUpdateSetSizeViolationCollector = ScriptInclude({
    $id: Now.ID['8984440b5b9f4fccaf6d5a6c7ce29a20'],
    name: 'MAFUpdateSetSizeViolationCollector',
    description: 'Counts update sets exceeding a configured sys_update_xml row threshold (sn_SE10007).',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFUpdateSetSizeViolationCollector.server.js'),
    apiName: 'x_maf_core.MAFUpdateSetSizeViolationCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
