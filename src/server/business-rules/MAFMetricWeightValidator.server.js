/**
 * Business rule script for MAFMetricWeightValidator.
 *
 * Runs after insert/update/delete on x_maf_core_metric_definition.
 * Calculates the weight sum for the affected category (or sub-category)
 * and warns the user if it deviates from 1.0.
 *
 * @param {GlideRecord} current - The current metric definition record.
 * @param {GlideRecord} previous - The previous metric definition record (on update/delete).
 */
;(function (current, previous) {
  var TOLERANCE = 0.02
  var TARGET_SUM = 1.0

  // Determine the category to check — use current on insert/update, previous on delete
  var categoryRef = !current.isNewRecord() && current.category.nil()
    ? previous.category
    : current.category

  if (!categoryRef || categoryRef.nil()) {
    return
  }

  var categoryId = categoryRef.toString()
  var categoryLabel = categoryRef.getDisplayValue()

  // Count distinct sub-categories under this category
  var subCatGr = new GlideAggregate('x_maf_core_sub_category')
  subCatGr.addQuery('category', categoryId)
  subCatGr.addQuery('active', true)
  subCatGr.addAggregate('COUNT')
  subCatGr.query()
  var subCatCount = 0
  if (subCatGr.next()) {
    subCatCount = parseInt(subCatGr.getAggregate('COUNT'), 10)
  }

  // Determine grouping strategy:
  // If there are multiple sub-categories AND the pack uses per-sub-category weighting
  // (like Platform Health), check each sub-category independently.
  // Otherwise check the whole category (like ITSM).
  var usesPerSubCategoryWeights = _detectPerSubCategoryWeighting(categoryId)

  if (usesPerSubCategoryWeights && subCatCount > 0) {
    _checkBySubCategory(categoryId, categoryLabel)
  } else {
    _checkByCategory(categoryId, categoryLabel)
  }

  /**
   * Detect whether this category uses per-sub-category weighting (metric weights
   * sum to 1.0 within each sub-category) vs category-level weighting (metric weights
   * sum to 1.0 across the entire category).
   */
  function _detectPerSubCategoryWeighting(catId) {
    if (subCatCount <= 1) {
      return false
    }

    // Sample the first sub-category: if its active metric weights sum close to 1.0,
    // the pack uses per-sub-category weighting.
    var sampleSubCat = new GlideRecord('x_maf_core_sub_category')
    sampleSubCat.addQuery('category', catId)
    sampleSubCat.addQuery('active', true)
    sampleSubCat.orderBy('order')
    sampleSubCat.setLimit(1)
    sampleSubCat.query()
    if (!sampleSubCat.next()) {
      return false
    }

    var sampleSum = _sumWeights('sub_category', sampleSubCat.getUniqueValue())
    return Math.abs(sampleSum - TARGET_SUM) < TOLERANCE
  }

  /**
   * Check weight sum for the entire category (ITSM pattern).
   */
  function _checkByCategory(catId, catLabel) {
    var weightSum = _sumWeights('category', catId)
    _emitMessage(catLabel, weightSum)
  }

  /**
   * Check weight sum for each sub-category independently (Platform Health pattern).
   */
  function _checkBySubCategory(catId, catLabel) {
    var subGr = new GlideRecord('x_maf_core_sub_category')
    subGr.addQuery('category', catId)
    subGr.addQuery('active', true)
    subGr.orderBy('order')
    subGr.query()

    while (subGr.next()) {
      var subId = subGr.getUniqueValue()
      var subLabel = subGr.getValue('label')
      var weightSum = _sumWeights('sub_category', subId)
      _emitMessage(catLabel + ' → ' + subLabel, weightSum)
    }
  }

  /**
   * Sum active metric weights grouped by the given field and value.
   */
  function _sumWeights(groupField, groupValue) {
    var ga = new GlideAggregate('x_maf_core_metric_definition')
    ga.addQuery(groupField, groupValue)
    ga.addQuery('active', true)
    ga.addAggregate('SUM', 'weight_in_category')
    ga.query()

    if (ga.next()) {
      return parseFloat(ga.getAggregate('SUM', 'weight_in_category')) || 0
    }
    return 0
  }

  /**
   * Emit an info or warning message based on the weight sum.
   */
  function _emitMessage(scopeLabel, weightSum) {
    var rounded = Math.round(weightSum * 10000) / 10000

    if (Math.abs(weightSum - TARGET_SUM) <= TOLERANCE) {
      if (Math.abs(weightSum - TARGET_SUM) > 0.001) {
        gs.addInfoMessage(
          'Metric weight sum for <b>' + scopeLabel + '</b> is <b>' + rounded +
          '</b> (expected 1.0). Close enough but consider adjusting for precision.'
        )
      }
      // Exact 1.0 — no message needed
    } else {
      gs.addErrorMessage(
        'Metric weight sum for <b>' + scopeLabel + '</b> is <b>' + rounded +
        '</b> — expected 1.0. Please update the metric weights in this ' +
        'group so they sum to exactly 1.0, otherwise scoring will be skewed.'
      )
    }
  }
})(current, previous)
