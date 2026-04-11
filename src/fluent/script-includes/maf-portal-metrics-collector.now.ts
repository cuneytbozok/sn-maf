import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafPortalMetricsCollector = ScriptInclude({
  $id: Now.ID['maf_si_portal_metrics_collector'],
  name: 'MAFPortalMetricsCollector',
  description:
    'Portal-scoped catalog/taxonomy metrics (counts, topic depth %, sc_cat_item % via default portal catalogs).',
  accessibleFrom: 'package_private',
  script: Now.include('../../server/script-includes/MAFPortalMetricsCollector.server.js'),
})
