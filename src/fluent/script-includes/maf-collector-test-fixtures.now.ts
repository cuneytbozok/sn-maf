import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafCollectorTestFixtures = ScriptInclude({
    $id: Now.ID['5f45e30c23d84e96b6eec3dc652b5fd5'],
    name: 'MAFCollectorTestFixtures',
    description:
        'Background Script helpers: synthetic checks, migration JSON, and runInstanceDependencyAudit for ITSM pack v3 table/query/scoring validation.',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFCollectorTestFixtures.server.js'),
    apiName: 'x_maf_core.MAFCollectorTestFixtures',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
