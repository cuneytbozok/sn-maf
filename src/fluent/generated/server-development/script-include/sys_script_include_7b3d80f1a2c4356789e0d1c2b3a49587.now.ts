import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['7b3d80f1a2c4356789e0d1c2b3a49587'],
    name: 'MAFPortalScopeHelper',
    script: Now.include('./sys_script_include_7b3d80f1a2c4356789e0d1c2b3a49587.server.js'),
    description:
        'Default sp_portal, m2m_sp_portal_catalog / m2m_sp_portal_taxonomy, and sc_cat_item.sc_catalogs query helpers for MAF.',
    apiName: 'x_maf_core.MAFPortalScopeHelper',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
