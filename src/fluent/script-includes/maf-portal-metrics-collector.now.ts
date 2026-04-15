import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafPortalMetricsCollector = ScriptInclude({
  $id: Now.ID['8c4e91a2b3d5467890f1e2d3c4b5a697'],
  name: 'MAFPortalMetricsCollector',
  description:
    'Portal-scoped catalog/taxonomy metrics (counts, topic depth %, sc_cat_item % via default portal catalogs).',
  accessibleFrom: 'package_private',
  script: Now.include('../../server/script-includes/MAFPortalMetricsCollector.server.js'),
})
