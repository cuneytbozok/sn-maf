gs.include('MAFMetricCollectorBase')
gs.include('MAFPortalScopeHelper')

/**
 * Portal-scoped taxonomy / catalog metrics.
 * Scans ALL active portals for catalogs and taxonomy-linked catalog items.
 */
var MAFPortalMetricsCollector = Class.create()
MAFPortalMetricsCollector.prototype = Object.extendsObject(MAFMetricCollectorBase.prototype, {
  initialize: function (metricDefGR, assessmentRunGR) {
    MAFMetricCollectorBase.prototype.initialize.call(this, metricDefGR, assessmentRunGR)
  },

  collect: function () {
    try {
      return this._collectInternal()
    } catch (e) {
      return { value: null, drillDownTable: null, drillDownQuery: null, error: String(e) }
    }
  },

  _collectInternal: function () {
    var p = this.params || {}
    var mode = String(p.mode || '')
    if (mode === 'taxonomy_m2m_count') return this._taxonomyM2MCount()
    if (mode === 'topic_parent_depth_percentage') return this._topicParentDepthPct()
    if (mode === 'sc_cat_item_percentage') return this._scCatItemPct(p)
    if (mode === 'sc_cat_item_count') return this._scCatItemCount()
    if (mode === 'catalog_flow_designer_adoption') return this._catalogFlowDesignerAdoption()
    return { value: null, drillDownTable: null, drillDownQuery: null, error: 'Unknown mode: ' + mode }
  },

  _taxonomyM2MCount: function () {
    var h = MAFPortalScopeHelper
    // Count taxonomies across ALL active portals
    var taxIds = h.getTaxonomyIdsFromAllPortals()
    if (taxIds.length === 0) {
      return {
        value: 0,
        drillDownTable: 'm2m_sp_portal_taxonomy',
        drillDownQuery: 'active=true',
        error: null,
      }
    }
    return {
      value: taxIds.length,
      drillDownTable: 'm2m_sp_portal_taxonomy',
      drillDownQuery: 'active=true',
      error: null,
    }
  },

  _topicParentDepthPct: function () {
    var h = MAFPortalScopeHelper
    // Get taxonomies from ALL portals
    var taxIds = h.getTaxonomyIdsFromAllPortals()
    var taxQ = h.buildTaxonomyInQuery(taxIds)
    if (!taxQ) {
      return {
        value: null,
        drillDownTable: 'topic',
        drillDownQuery: '',
        error: 'No taxonomies linked to any active portal',
      }
    }
    var denQ = taxQ
    var numQ = h.mergeQueries(taxQ, 'parent_topicISNOTEMPTY')
    var num = this._count('topic', numQ)
    var den = this._count('topic', denQ)
    if (!den || den === 0) return { value: 0, drillDownTable: 'topic', drillDownQuery: numQ, error: null }
    return { value: (num / den) * 100, drillDownTable: 'topic', drillDownQuery: numQ, error: null }
  },

  _scCatItemPct: function (p) {
    var h = MAFPortalScopeHelper
    var sr = h.getPortalCatItemScope()
    if (!sr.catItemScope) {
      return { value: null, drillDownTable: 'sc_cat_item', drillDownQuery: '', error: sr.error }
    }
    var numS = String(p.numerator_suffix || '')
    var denS = String(p.denominator_suffix != null ? p.denominator_suffix : 'active=true')
    var numQ = h.mergeQueries(sr.catItemScope, numS)
    var denQ = h.mergeQueries(sr.catItemScope, denS)
    var num = this._count('sc_cat_item', numQ)
    var den = this._count('sc_cat_item', denQ)
    if (!den || den === 0) return { value: 0, drillDownTable: 'sc_cat_item', drillDownQuery: numQ, error: null }
    return { value: (num / den) * 100, drillDownTable: 'sc_cat_item', drillDownQuery: numQ, error: null }
  },

  /**
   * % of catalog items using Flow Designer among those with any fulfillment.
   */
  _catalogFlowDesignerAdoption: function () {
    var h = MAFPortalScopeHelper
    var sr = h.getPortalCatItemScope()
    if (!sr.catItemScope) {
      return { value: null, drillDownTable: 'sc_cat_item', drillDownQuery: '', error: sr.error }
    }
    var numQ = h.mergeQueries(sr.catItemScope, 'active=true^flow_designer_flowISNOTEMPTY')
    var denQ =
      h.mergeQueries(sr.catItemScope, 'active=true^workflowISNOTEMPTY') +
      '^NQ' +
      h.mergeQueries(sr.catItemScope, 'active=true^flow_designer_flowISNOTEMPTY')
    var num = this._count('sc_cat_item', numQ)
    var den = this._count('sc_cat_item', denQ)
    if (!den || den === 0) return { value: 0, drillDownTable: 'sc_cat_item', drillDownQuery: numQ, error: null }
    return { value: (num / den) * 100, drillDownTable: 'sc_cat_item', drillDownQuery: numQ, error: null }
  },

  _scCatItemCount: function () {
    var h = MAFPortalScopeHelper
    var sr = h.getPortalCatItemScope()
    if (!sr.catItemScope) {
      return { value: null, drillDownTable: 'sc_cat_item', drillDownQuery: '', error: sr.error }
    }
    var q = h.mergeQueries(sr.catItemScope, 'active=true')
    return { value: this._count('sc_cat_item', q), drillDownTable: 'sc_cat_item', drillDownQuery: q, error: null }
  },

  _count: function (table, encodedQuery) {
    var ga = new GlideAggregate(table)
    if (encodedQuery) ga.addEncodedQuery(encodedQuery)
    ga.addAggregate('COUNT')
    ga.query()
    if (!ga.next()) return 0
    return parseFloat(ga.getAggregate('COUNT')) || 0
  },

  type: 'MAFPortalMetricsCollector',
})
