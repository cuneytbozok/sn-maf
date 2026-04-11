import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafPortalScopeHelper = ScriptInclude({
    $id: Now.ID['maf_si_portal_scope_helper'],
    name: 'MAFPortalScopeHelper',
    description:
        'Default sp_portal, m2m_sp_portal_catalog / m2m_sp_portal_taxonomy, and sc_cat_item.sc_catalogs query helpers for MAF.',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFPortalScopeHelper.server.js'),
    apiName: 'x_maf_core.MAFPortalScopeHelper',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
