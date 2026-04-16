import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafServiceGovernanceFieldsCollector = ScriptInclude({
    $id: Now.ID['a1b2c3d4e5f6478990a1b2c3d4e5f60b'],
    name: 'MAFServiceGovernanceFieldsCollector',
    description:
        'Checks what % of records in a service table (cmdb_ci_service, service_offering, spm_service_portfolio) have all specified governance fields (support_group, change_group, managed_by, owned_by) populated.',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFServiceGovernanceFieldsCollector.server.js'),
    apiName: 'x_maf_core.MAFServiceGovernanceFieldsCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
