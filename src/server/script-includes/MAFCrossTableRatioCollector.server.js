gs.include('MAFMetricCollectorBase')

/**
 * COUNT(num) / COUNT(den) * 100 across two tables (PRD §5.2). Optional distinct counts via groupBy + row count.
 */
var MAFCrossTableRatioCollector = Class.create()
MAFCrossTableRatioCollector.prototype = Object.extendsObject(MAFMetricCollectorBase.prototype, {
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
    if (p.collection_mode === 'parent_without_matching_children') {
      return this._collectParentWithoutMatchingChildren(p)
    }
    var numTable = String(p.numerator_table || '').trim()
    var numF = String(p.numerator_filter != null ? p.numerator_filter : '').trim()
    var denTable = String(p.denominator_table || '').trim()
    var denF = String(p.denominator_filter != null ? p.denominator_filter : '').trim()
    if (p.portal_catalog_scope === true || p.portal_catalog_scope === 'true') {
      if (!gs.include('MAFPortalScopeHelper')) {
        return {
          value: null,
          drillDownTable: null,
          drillDownQuery: null,
          error: 'MAFPortalScopeHelper not found',
        }
      }
      var h = MAFPortalScopeHelper
      var sr = h.getPortalCatItemScope()
      if (!sr.catItemScope) {
        return { value: null, drillDownTable: null, drillDownQuery: null, error: 'portal_catalog_scope: ' + sr.error }
      }
      // Build scope queries for sc_cat_item and reference-field tables
      var catScope = sr.catItemScope
      var catScopeRITM = h.buildRefScopeFromResult('cat_item', sr)
      var catScopeIoSet = h.buildRefScopeFromResult('sc_cat_item', sr)
      var catScopeUIP = h.buildRefScopeFromResult('catalog_item', sr)
      var catScopeCSC = h.buildRefScopeFromResult('cat_item', sr)
      if (numTable === 'sc_cat_item' && catScope) numF = h.mergeQueries(catScope, numF)
      if (denTable === 'sc_cat_item' && catScope) denF = h.mergeQueries(catScope, denF)
      if (numTable === 'sc_req_item' && catScopeRITM) numF = h.mergeQueries(catScopeRITM, numF)
      if (denTable === 'sc_req_item' && catScopeRITM) denF = h.mergeQueries(catScopeRITM, denF)
      if (numTable === 'io_set_item' && catScopeIoSet) numF = h.mergeQueries(catScopeIoSet, numF)
      if (denTable === 'io_set_item' && catScopeIoSet) denF = h.mergeQueries(catScopeIoSet, denF)
      if (numTable === 'catalog_ui_policy' && catScopeUIP) numF = h.mergeQueries(catScopeUIP, numF)
      if (denTable === 'catalog_ui_policy' && catScopeUIP) denF = h.mergeQueries(catScopeUIP, denF)
      if (numTable === 'catalog_script_client' && catScopeCSC) numF = h.mergeQueries(catScopeCSC, numF)
      if (denTable === 'catalog_script_client' && catScopeCSC) denF = h.mergeQueries(catScopeCSC, denF)
    }
    if (!numTable || !denTable) {
      return {
        value: null,
        drillDownTable: null,
        drillDownQuery: null,
        error: 'numerator_table and denominator_table are required',
      }
    }

    var grNum = new GlideRecord(numTable)
    var grDen = new GlideRecord(denTable)
    if (!grNum.isValid()) {
      return { value: null, drillDownTable: null, drillDownQuery: null, error: 'table ' + numTable + ' not available' }
    }
    if (!grDen.isValid()) {
      return { value: null, drillDownTable: null, drillDownQuery: null, error: 'table ' + denTable + ' not available' }
    }

    var numDistinct = p.numerator_distinct_field != null && String(p.numerator_distinct_field) !== '' ? String(p.numerator_distinct_field).trim() : ''
    var denDistinct = p.denominator_distinct_field != null && String(p.denominator_distinct_field) !== '' ? String(p.denominator_distinct_field).trim() : ''

    if (numDistinct && !grNum.isValidField(numDistinct)) {
      return {
        value: null,
        drillDownTable: numTable,
        drillDownQuery: numF,
        error: 'numerator_distinct_field is not valid on table ' + numTable,
      }
    }
    if (denDistinct && !grDen.isValidField(denDistinct)) {
      return {
        value: null,
        drillDownTable: numTable,
        drillDownQuery: numF,
        error: 'denominator_distinct_field is not valid on table ' + denTable,
      }
    }

    var num = this._count(numTable, numF, numDistinct)
    var den = this._count(denTable, denF, denDistinct)

    var emptyVal = p.empty_denominator_value
    if (emptyVal === null || typeof emptyVal === 'undefined') emptyVal = 0
    if (!den || den === 0) {
      return {
        value: Number(emptyVal),
        drillDownTable: numTable,
        drillDownQuery: numF,
        error: null,
      }
    }
    return {
      value: (num / den) * 100,
      drillDownTable: numTable,
      drillDownQuery: numF,
      error: null,
    }
  },

  _count: function (table, encodedQuery, distinctField) {
    if (distinctField) return this._countDistinct(table, encodedQuery, distinctField)
    var ga = new GlideAggregate(table)
    if (encodedQuery) ga.addEncodedQuery(encodedQuery)
    ga.addAggregate('COUNT')
    ga.query()
    if (!ga.next()) return 0
    var v = ga.getAggregate('COUNT')
    return parseFloat(v) || 0
  },

  _countDistinct: function (table, encodedQuery, fieldName) {
    var ga = new GlideAggregate(table)
    if (encodedQuery) ga.addEncodedQuery(encodedQuery)
    ga.groupBy(fieldName)
    ga.addAggregate('COUNT', null)
    ga.query()
    var n = 0
    while (ga.next()) n++
    return n
  },

  /**
   * P-US-03 — Count parent rows matching {@code parent_filter} with no child row matching
   * {@code child_match_filter} on {@code child_parent_field} (e.g. completed update sets with no customer XML).
   */
  _collectParentWithoutMatchingChildren: function (p) {
    var parentTable = String(p.parent_table || '').trim()
    var parentFilter = String(p.parent_filter != null ? p.parent_filter : '').trim()
    var childTable = String(p.child_table || '').trim()
    var childLink = String(p.child_parent_field || '').trim()
    var childMatchFilter = String(p.child_match_filter != null ? p.child_match_filter : '').trim()
    if (!parentTable || !childTable || !childLink) {
      return {
        value: null,
        drillDownTable: null,
        drillDownQuery: null,
        error: 'parent_table, child_table, and child_parent_field are required',
      }
    }
    var grP = new GlideRecord(parentTable)
    var grC = new GlideRecord(childTable)
    if (!grP.isValid()) {
      return { value: null, drillDownTable: null, drillDownQuery: null, error: 'parent table not available: ' + parentTable }
    }
    if (!grC.isValid()) {
      return { value: null, drillDownTable: null, drillDownQuery: null, error: 'child table not available: ' + childTable }
    }
    if (!grC.isValidField(childLink)) {
      return {
        value: null,
        drillDownTable: parentTable,
        drillDownQuery: parentFilter,
        error: 'child_parent_field is not valid on ' + childTable,
      }
    }
    var hasQualifyingChild = {}
    var ga = new GlideAggregate(childTable)
    if (childMatchFilter) ga.addEncodedQuery(childMatchFilter)
    ga.groupBy(childLink)
    ga.addAggregate('COUNT', null)
    ga.query()
    while (ga.next()) {
      var pid = ga.getValue(childLink)
      if (pid) hasQualifyingChild[pid] = true
    }
    var pr = new GlideRecord(parentTable)
    if (parentFilter) pr.addEncodedQuery(parentFilter)
    pr.query()
    var n = 0
    while (pr.next()) {
      if (!hasQualifyingChild[pr.getUniqueValue()]) n++
    }
    return {
      value: Number(n),
      drillDownTable: parentTable,
      drillDownQuery: parentFilter,
      error: null,
    }
  },

  type: 'MAFCrossTableRatioCollector',
})
