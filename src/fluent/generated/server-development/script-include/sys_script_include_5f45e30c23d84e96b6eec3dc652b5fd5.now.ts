import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['5f45e30c23d84e96b6eec3dc652b5fd5'],
    name: 'MAFCollectorTestFixtures',
    script: Now.include('./sys_script_include_5f45e30c23d84e96b6eec3dc652b5fd5.server.js'),
    description:
        'Background Script helpers: synthetic checks, migration JSON, and runInstanceDependencyAudit for ITSM pack v3 table/query/scoring validation.',
    apiName: 'x_maf_core.MAFCollectorTestFixtures',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
