import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['8e4c2a1b9d0e4f1a8b2c3d4e5f607182'],
    name: 'MAFSchemaIntrospectionCollector',
    script: Now.include('./sys_script_include_8e4c2a1b9d0e4f1a8b2c3d4e5f607182.server.js'),
    description:
        'Allowlisted schema/log introspection (PRD §5): count, group_collision, row_count_over_threshold, windowed_count, windowed_distinct, acl_effectively_open; row_count_over_threshold supports require_no_active_archive (sys_archive).',
    apiName: 'x_maf_core.MAFSchemaIntrospectionCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
