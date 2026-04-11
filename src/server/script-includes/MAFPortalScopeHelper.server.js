/**
 * Resolves portal scope for MAF catalog metrics.
 *
 * Gathers catalogs and taxonomy-linked catalog items from ALL active portals,
 * not just the default — because a typical instance has:
 *   - Service Portal with catalogs (m2m_sp_portal_catalog)
 *   - Employee Center with taxonomies (m2m_sp_portal_taxonomy → topic → m2m_connected_content)
 * Both expose catalog items to users and should be assessed.
 *
 * Taxonomy resolution uses {@link m2m_connected_content} (Employee Center model)
 * with fallback to {@link m2m_sc_cat_item_topic} (classic model).
 *
 * Some OOTB portals (e.g. Employee Center) can have sp_portal.inactive NULL while still active
 * in the UI; addQuery('inactive', false) omits those rows.
 */

function mafApplySpPortalActiveFilter(gr) {
    gr.addEncodedQuery('inactive=false^ORinactiveISEMPTY')
}

var MAFPortalScopeHelper = {
    /**
     * Returns the sys_id of the default portal, or the first active portal by title.
     * Tie-break: when multiple rows match a branch (e.g. duplicate default=true), lowest title wins.
     */
    getDefaultPortalId: function () {
        var gr = new GlideRecord('sp_portal')
        gr.addQuery('default', true)
        mafApplySpPortalActiveFilter(gr)
        gr.orderBy('title')
        gr.query()
        if (gr.next()) return gr.getUniqueValue()
        gr = new GlideRecord('sp_portal')
        mafApplySpPortalActiveFilter(gr)
        gr.orderBy('title')
        gr.query()
        if (gr.next()) return gr.getUniqueValue()
        return null
    },

    /**
     * Returns sys_ids of ALL active portals.
     */
    getAllActivePortalIds: function () {
        var ids = []
        var gr = new GlideRecord('sp_portal')
        mafApplySpPortalActiveFilter(gr)
        gr.query()
        while (gr.next()) {
            ids.push(gr.getUniqueValue())
        }
        return ids
    },

    getCatalogIdsForPortal: function (portalSysId) {
        var ids = []
        if (!portalSysId) return ids
        var m2m = new GlideRecord('m2m_sp_portal_catalog')
        m2m.addQuery('sp_portal', portalSysId)
        m2m.addQuery('active', true)
        m2m.query()
        while (m2m.next()) {
            var c = m2m.getValue('sc_catalog')
            if (c) ids.push(String(c))
        }
        if (ids.length === 0) {
            var pr = new GlideRecord('sp_portal')
            if (pr.get(portalSysId)) {
                var sc = pr.getValue('sc_catalog')
                if (sc) ids.push(String(sc))
            }
        }
        return ids
    },

    /**
     * Gather catalog IDs from ALL active portals (deduplicated).
     */
    getCatalogIdsFromAllPortals: function () {
        var seen = {}
        var ids = []
        var portalIds = this.getAllActivePortalIds()
        for (var i = 0; i < portalIds.length; i++) {
            var portalCats = this.getCatalogIdsForPortal(portalIds[i])
            for (var j = 0; j < portalCats.length; j++) {
                if (!seen[portalCats[j]]) {
                    seen[portalCats[j]] = true
                    ids.push(portalCats[j])
                }
            }
        }
        return ids
    },

    getTaxonomyIdsForPortal: function (portalSysId) {
        var ids = []
        if (!portalSysId) return ids
        var m2m = new GlideRecord('m2m_sp_portal_taxonomy')
        m2m.addQuery('sp_portal', portalSysId)
        m2m.addQuery('active', true)
        m2m.query()
        while (m2m.next()) {
            var t = m2m.getValue('taxonomy')
            if (t) ids.push(String(t))
        }
        return ids
    },

    /**
     * Gather taxonomy IDs from ALL active portals (deduplicated).
     */
    getTaxonomyIdsFromAllPortals: function () {
        var seen = {}
        var ids = []
        var portalIds = this.getAllActivePortalIds()
        for (var i = 0; i < portalIds.length; i++) {
            var portalTax = this.getTaxonomyIdsForPortal(portalIds[i])
            for (var j = 0; j < portalTax.length; j++) {
                if (!seen[portalTax[j]]) {
                    seen[portalTax[j]] = true
                    ids.push(portalTax[j])
                }
            }
        }
        return ids
    },

    /**
     * Encoded query fragment for {@link sc_cat_item#sc_catalogs} list field matching any catalog.
     * @returns {string|null} null if no catalogs.
     */
    buildScCatalogsEncodedQuery: function (catalogIds) {
        if (!catalogIds || catalogIds.length === 0) return null
        if (catalogIds.length === 1) return 'sc_catalogsLIKE' + catalogIds[0]
        var parts = []
        for (var i = 0; i < catalogIds.length; i++) parts.push('sc_catalogsLIKE' + catalogIds[i])
        return parts.join('^OR')
    },

    /**
     * Dot-walk from a reference to {@link sc_cat_item}.
     * @param {string} refFieldName reference field name on the base table.
     */
    buildScCatalogsEncodedQueryForCatItemRefField: function (refFieldName, catalogIds) {
        if (!catalogIds || catalogIds.length === 0) return null
        if (catalogIds.length === 1) return refFieldName + '.sc_catalogsLIKE' + catalogIds[0]
        var parts = []
        for (var i = 0; i < catalogIds.length; i++) parts.push(refFieldName + '.sc_catalogsLIKE' + catalogIds[i])
        return parts.join('^OR')
    },

    buildTaxonomyInQuery: function (taxonomyIds) {
        if (!taxonomyIds || taxonomyIds.length === 0) return null
        return 'taxonomyIN' + taxonomyIds.join(',')
    },

    /**
     * Resolve catalog item sys_ids via taxonomy → topic → catalog items.
     * Uses m2m_connected_content (Employee Center) with fallback to m2m_sc_cat_item_topic (classic).
     * @param {string[]} taxonomyIds
     * @returns {string[]} catalog item sys_ids
     */
    getCatItemIdsFromTaxonomies: function (taxonomyIds) {
        if (!taxonomyIds || taxonomyIds.length === 0) return []

        // Collect all topic sys_ids belonging to these taxonomies
        var topicIds = []
        var tg = new GlideRecord('topic')
        tg.addEncodedQuery('taxonomyIN' + taxonomyIds.join(','))
        tg.query()
        while (tg.next()) {
            topicIds.push(tg.getUniqueValue())
        }
        if (topicIds.length === 0) return []

        var catItemIds = []
        var seen = {}

        // Primary: Employee Center model — m2m_connected_content
        var cc = new GlideRecord('m2m_connected_content')
        if (cc.isValid()) {
            cc.addEncodedQuery('catalog_itemISNOTEMPTY^topicIN' + topicIds.join(','))
            cc.query()
            while (cc.next()) {
                var cid = cc.getValue('catalog_item')
                if (cid && !seen[cid]) {
                    seen[cid] = true
                    catItemIds.push(cid)
                }
            }
        }

        // Fallback: classic model — m2m_sc_cat_item_topic
        if (catItemIds.length === 0) {
            var m2m = new GlideRecord('m2m_sc_cat_item_topic')
            if (m2m.isValid()) {
                m2m.addEncodedQuery('sc_cat_itemISNOTEMPTY^sc_topicIN' + topicIds.join(','))
                m2m.query()
                while (m2m.next()) {
                    var cid2 = m2m.getValue('sc_cat_item')
                    if (cid2 && !seen[cid2]) {
                        seen[cid2] = true
                        catItemIds.push(cid2)
                    }
                }
            }
        }

        return catItemIds
    },

    /**
     * Legacy wrapper — resolves taxonomy for a single portal.
     */
    getCatItemIdsFromTaxonomy: function (portalSysId) {
        var taxIds = this.getTaxonomyIdsForPortal(portalSysId)
        return this.getCatItemIdsFromTaxonomies(taxIds)
    },

    /**
     * Build an encoded query that scopes sc_cat_item by sys_id list.
     */
    buildCatItemSysIdQuery: function (catItemIds) {
        if (!catItemIds || catItemIds.length === 0) return null
        return 'sys_idIN' + catItemIds.join(',')
    },

    /**
     * Build an encoded query that scopes a table referencing sc_cat_item via a ref field.
     */
    buildCatItemSysIdQueryForRef: function (refFieldName, catItemIds) {
        if (!catItemIds || catItemIds.length === 0) return null
        return refFieldName + '.sys_idIN' + catItemIds.join(',')
    },

    /**
     * Unified scope resolution across ALL active portals.
     * Gathers catalogs from all portals + taxonomy-linked items from all portals.
     * Combines with OR when both sources have results.
     *
     * @returns {{ method: string, catItemScope: string|null, catIds: string[], catItemIds: string[], error: string|null }}
     *   method: 'catalog' | 'taxonomy' | 'both' | 'none'
     */
    getPortalCatItemScope: function () {
        // Gather catalogs across all portals
        var catIds = this.getCatalogIdsFromAllPortals()
        var catalogScope = this.buildScCatalogsEncodedQuery(catIds)

        // Gather taxonomy-linked catalog items across all portals
        var taxIds = this.getTaxonomyIdsFromAllPortals()
        var catItemIds = this.getCatItemIdsFromTaxonomies(taxIds)
        var taxonomyScope = this.buildCatItemSysIdQuery(catItemIds)

        if (catalogScope && taxonomyScope) {
            var combined = catalogScope + '^NQ' + taxonomyScope
            return { method: 'both', catItemScope: combined, catIds: catIds, catItemIds: catItemIds, error: null }
        }

        if (catalogScope) {
            return { method: 'catalog', catItemScope: catalogScope, catIds: catIds, catItemIds: [], error: null }
        }

        if (taxonomyScope) {
            return { method: 'taxonomy', catItemScope: taxonomyScope, catIds: [], catItemIds: catItemIds, error: null }
        }

        return {
            method: 'none',
            catItemScope: null,
            catIds: [],
            catItemIds: [],
            error: 'No catalogs or taxonomy-linked catalog items found across any active portal',
        }
    },

    /**
     * Build scope query for a reference field pointing to sc_cat_item.
     */
    buildRefScopeFromResult: function (refFieldName, scopeResult) {
        if (scopeResult.method === 'catalog') {
            return this.buildScCatalogsEncodedQueryForCatItemRefField(refFieldName, scopeResult.catIds)
        }
        if (scopeResult.method === 'taxonomy') {
            return this.buildCatItemSysIdQueryForRef(refFieldName, scopeResult.catItemIds)
        }
        if (scopeResult.method === 'both') {
            var catPart = this.buildScCatalogsEncodedQueryForCatItemRefField(refFieldName, scopeResult.catIds)
            var taxPart = this.buildCatItemSysIdQueryForRef(refFieldName, scopeResult.catItemIds)
            if (catPart && taxPart) return catPart + '^NQ' + taxPart
            return catPart || taxPart
        }
        return null
    },

    mergeQueries: function (scope, rest) {
        var s = scope != null ? String(scope).trim() : ''
        var r = rest != null ? String(rest).trim() : ''
        if (!s) return r
        if (!r) return s
        return s + '^' + r
    },

    type: 'MAFPortalScopeHelper',
}
