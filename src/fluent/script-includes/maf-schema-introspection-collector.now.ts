import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafSchemaIntrospectionCollector = ScriptInclude({
    $id: Now.ID['maf_si_schema_introspection_collector'],
    name: 'MAFSchemaIntrospectionCollector',
    description:
        'Allowlisted schema/log introspection (PRD §5): count, group_collision, row_count_over_threshold, windowed_count, windowed_distinct, acl_effectively_open; row_count_over_threshold supports require_no_active_archive (sys_archive).',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFSchemaIntrospectionCollector.server.js'),
    apiName: 'x_maf_core.MAFSchemaIntrospectionCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
