import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['maf_acl_pack_read'],
    type: 'record',
    table: 'x_maf_core_pack',
    operation: 'read',
    roles: ['x_maf_core.viewer', 'x_maf_core.user', 'x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_pack_write'],
    type: 'record',
    table: 'x_maf_core_pack',
    operation: 'write',
    roles: ['x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_pack_create'],
    type: 'record',
    table: 'x_maf_core_pack',
    operation: 'create',
    roles: ['x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_pack_delete'],
    type: 'record',
    table: 'x_maf_core_pack',
    operation: 'delete',
    roles: ['x_maf_core.admin'],
    active: true,
})

Acl({
    $id: Now.ID['maf_acl_category_read'],
    type: 'record',
    table: 'x_maf_core_category',
    operation: 'read',
    roles: ['x_maf_core.viewer', 'x_maf_core.user', 'x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_category_write'],
    type: 'record',
    table: 'x_maf_core_category',
    operation: 'write',
    roles: ['x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_category_create'],
    type: 'record',
    table: 'x_maf_core_category',
    operation: 'create',
    roles: ['x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_category_delete'],
    type: 'record',
    table: 'x_maf_core_category',
    operation: 'delete',
    roles: ['x_maf_core.admin'],
    active: true,
})

Acl({
    $id: Now.ID['maf_acl_metric_definition_read'],
    type: 'record',
    table: 'x_maf_core_metric_definition',
    operation: 'read',
    roles: ['x_maf_core.viewer', 'x_maf_core.user', 'x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_metric_definition_write'],
    type: 'record',
    table: 'x_maf_core_metric_definition',
    operation: 'write',
    roles: ['x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_metric_definition_create'],
    type: 'record',
    table: 'x_maf_core_metric_definition',
    operation: 'create',
    roles: ['x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_metric_definition_delete'],
    type: 'record',
    table: 'x_maf_core_metric_definition',
    operation: 'delete',
    roles: ['x_maf_core.admin'],
    active: true,
})

Acl({
    $id: Now.ID['maf_acl_assessment_run_read'],
    type: 'record',
    table: 'x_maf_core_assessment_run',
    operation: 'read',
    roles: ['x_maf_core.viewer', 'x_maf_core.user', 'x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_assessment_run_write'],
    type: 'record',
    table: 'x_maf_core_assessment_run',
    operation: 'write',
    roles: ['x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_assessment_run_create'],
    type: 'record',
    table: 'x_maf_core_assessment_run',
    operation: 'create',
    roles: ['x_maf_core.user', 'x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_assessment_run_delete'],
    type: 'record',
    table: 'x_maf_core_assessment_run',
    operation: 'delete',
    roles: ['x_maf_core.admin'],
    active: true,
})

Acl({
    $id: Now.ID['maf_acl_collector_eval_read'],
    type: 'record',
    table: 'x_maf_core_collector_eval',
    operation: 'read',
    roles: ['x_maf_core.viewer', 'x_maf_core.user', 'x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_collector_eval_write'],
    type: 'record',
    table: 'x_maf_core_collector_eval',
    operation: 'write',
    roles: ['x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_collector_eval_create'],
    type: 'record',
    table: 'x_maf_core_collector_eval',
    operation: 'create',
    roles: ['x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_collector_eval_delete'],
    type: 'record',
    table: 'x_maf_core_collector_eval',
    operation: 'delete',
    roles: ['x_maf_core.admin'],
    active: true,
})

Acl({
    $id: Now.ID['maf_acl_metric_result_read'],
    type: 'record',
    table: 'x_maf_core_metric_result',
    operation: 'read',
    roles: ['x_maf_core.viewer', 'x_maf_core.user', 'x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_metric_result_write'],
    type: 'record',
    table: 'x_maf_core_metric_result',
    operation: 'write',
    roles: ['x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_metric_result_create'],
    type: 'record',
    table: 'x_maf_core_metric_result',
    operation: 'create',
    roles: ['x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_metric_result_delete'],
    type: 'record',
    table: 'x_maf_core_metric_result',
    operation: 'delete',
    roles: ['x_maf_core.admin'],
    active: true,
})

Acl({
    $id: Now.ID['maf_acl_category_score_read'],
    type: 'record',
    table: 'x_maf_core_category_score',
    operation: 'read',
    roles: ['x_maf_core.viewer', 'x_maf_core.user', 'x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_category_score_write'],
    type: 'record',
    table: 'x_maf_core_category_score',
    operation: 'write',
    roles: ['x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_category_score_create'],
    type: 'record',
    table: 'x_maf_core_category_score',
    operation: 'create',
    roles: ['x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_category_score_delete'],
    type: 'record',
    table: 'x_maf_core_category_score',
    operation: 'delete',
    roles: ['x_maf_core.admin'],
    active: true,
})

Acl({
    $id: Now.ID['maf_acl_sub_category_read'],
    type: 'record',
    table: 'x_maf_core_sub_category',
    operation: 'read',
    roles: ['x_maf_core.viewer', 'x_maf_core.user', 'x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_sub_category_write'],
    type: 'record',
    table: 'x_maf_core_sub_category',
    operation: 'write',
    roles: ['x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_sub_category_create'],
    type: 'record',
    table: 'x_maf_core_sub_category',
    operation: 'create',
    roles: ['x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_sub_category_delete'],
    type: 'record',
    table: 'x_maf_core_sub_category',
    operation: 'delete',
    roles: ['x_maf_core.admin'],
    active: true,
})

Acl({
    $id: Now.ID['maf_acl_sub_category_score_read'],
    type: 'record',
    table: 'x_maf_core_sub_category_score',
    operation: 'read',
    roles: ['x_maf_core.viewer', 'x_maf_core.user', 'x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_sub_category_score_write'],
    type: 'record',
    table: 'x_maf_core_sub_category_score',
    operation: 'write',
    roles: ['x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_sub_category_score_create'],
    type: 'record',
    table: 'x_maf_core_sub_category_score',
    operation: 'create',
    roles: ['x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_sub_category_score_delete'],
    type: 'record',
    table: 'x_maf_core_sub_category_score',
    operation: 'delete',
    roles: ['x_maf_core.admin'],
    active: true,
})

Acl({
    $id: Now.ID['maf_acl_ai_summary_read'],
    type: 'record',
    table: 'x_maf_core_ai_summary',
    operation: 'read',
    roles: ['x_maf_core.viewer', 'x_maf_core.user', 'x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_ai_summary_write'],
    type: 'record',
    table: 'x_maf_core_ai_summary',
    operation: 'write',
    roles: ['x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_ai_summary_create'],
    type: 'record',
    table: 'x_maf_core_ai_summary',
    operation: 'create',
    roles: ['x_maf_core.admin'],
    active: true,
})
Acl({
    $id: Now.ID['maf_acl_ai_summary_delete'],
    type: 'record',
    table: 'x_maf_core_ai_summary',
    operation: 'delete',
    roles: ['x_maf_core.admin'],
    active: true,
})
