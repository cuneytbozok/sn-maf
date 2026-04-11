import '@servicenow/sdk/global'
import { CrossScopePrivilege } from '@servicenow/sdk/core'

/**
 * Cross-scope read privileges for global tables used by MAF collectors.
 * Without these, scoped app queries return ScopeAccessNotGrantedException.
 */

// Flow Designer execution context — used by p_log_06_flow_designer_errors_7d
CrossScopePrivilege({
  $id: Now.ID['maf_csp_read_sys_flow_context'],
  operation: 'read',
  status: 'allowed',
  targetName: 'sys_flow_context',
  targetScope: 'global',
  targetType: 'sys_db_object',
})

// Service Portal — used by MAFPortalScopeHelper to find default portal
CrossScopePrivilege({
  $id: Now.ID['maf_csp_read_sp_portal'],
  operation: 'read',
  status: 'allowed',
  targetName: 'sp_portal',
  targetScope: 'global',
  targetType: 'sys_db_object',
})

// Portal-to-catalog M2M — used by MAFPortalScopeHelper
CrossScopePrivilege({
  $id: Now.ID['maf_csp_read_m2m_sp_portal_catalog'],
  operation: 'read',
  status: 'allowed',
  targetName: 'm2m_sp_portal_catalog',
  targetScope: 'global',
  targetType: 'sys_db_object',
})

// Portal-to-taxonomy M2M — used by MAFPortalScopeHelper
CrossScopePrivilege({
  $id: Now.ID['maf_csp_read_m2m_sp_portal_taxonomy'],
  operation: 'read',
  status: 'allowed',
  targetName: 'm2m_sp_portal_taxonomy',
  targetScope: 'global',
  targetType: 'sys_db_object',
})

// Taxonomy topics — used by MAFPortalScopeHelper and MAFPortalMetricsCollector
CrossScopePrivilege({
  $id: Now.ID['maf_csp_read_topic'],
  operation: 'read',
  status: 'allowed',
  targetName: 'topic',
  targetScope: 'global',
  targetType: 'sys_db_object',
})

// Employee Center connected content — links topics to catalog items
CrossScopePrivilege({
  $id: Now.ID['maf_csp_read_m2m_connected_content'],
  operation: 'read',
  status: 'allowed',
  targetName: 'm2m_connected_content',
  targetScope: 'global',
  targetType: 'sys_db_object',
})

// Classic topic-to-catalog-item M2M (fallback)
CrossScopePrivilege({
  $id: Now.ID['maf_csp_read_m2m_sc_cat_item_topic'],
  operation: 'read',
  status: 'allowed',
  targetName: 'm2m_sc_cat_item_topic',
  targetScope: 'global',
  targetType: 'sys_db_object',
})

// Catalog items — core table for all catalog metrics
CrossScopePrivilege({
  $id: Now.ID['maf_csp_read_sc_cat_item'],
  operation: 'read',
  status: 'allowed',
  targetName: 'sc_cat_item',
  targetScope: 'global',
  targetType: 'sys_db_object',
})

// Knowledge article views — used by kb_article_active_readership_90d
CrossScopePrivilege({
  $id: Now.ID['maf_csp_read_kb_use'],
  operation: 'read',
  status: 'allowed',
  targetName: 'kb_use',
  targetScope: 'global',
  targetType: 'sys_db_object',
})
