/**
 * Business rule script for MAFMetricWeightValidator.
 *
 * Runs after insert/update/delete on x_maf_core_metric_definition.
 * Calculates the weight sum for the affected category and warns
 * the user if it deviates from 1.0.
 *
 * Detection strategy:
 *   1. Check category-level sum first — if ~1.0, done (ITSM pattern).
 *   2. If not, check whether ALL sub-categories individually sum to ~1.0.
 *      Only if a majority pass does it switch to per-sub-category reporting
 *      (Platform Health pattern).
 *   3. Otherwise report the category-level deviation.
 */
(function (current, previous) {
  var TOLERANCE = 0.02
  var TARGET_SUM = 1.0

  var categoryRef = !current.isNewRecord() && current.category.nil()
    ? previous.category
    : current.category

  if (!categoryRef || categoryRef.nil()) {
    return
  }

  var categoryId = categoryRef.toString()
  var categoryLabel = categoryRef.getDisplayValue()

  // Step 1: Check category-level sum
  var catSum = _sumWeights('category', categoryId)

  if (Math.abs(catSum - TARGET_SUM) <= TOLERANCE) {
    // Category-level is fine — emit info if close but not exact
    if (Math.abs(catSum - TARGET_SUM) > 0.001) {
      gs.addInfoMessage(
        'Metric weight sum for <b>' + categoryLabel + '</b> is <b>' +
        _round(catSum) + '</b> (expected 1.0). Close enough but consider ' +
        'adjusting for precision.'
      )
    }
    return
  }

  // Step 2: Category sum is off — check sub-categories
  var subGr = new GlideRecord('x_maf_core_sub_category')
  subGr.addQuery('category', categoryId)
  subGr.addQuery('active', true)
  subGr.orderBy('order')
  subGr.query()

  var subResults = []
  while (subGr.next()) {
    subResults.push({
      id: subGr.getUniqueValue(),
      label: subGr.getValue('label'),
      sum: _sumWeights('sub_category', subGr.getUniqueValue()),
    })
  }

  // If only one sub-category or none, report at category level
  if (subResults.length <= 1) {
    _emitError(categoryLabel, catSum)
    return
  }

  // Check if this is per-sub-category weighting (Platform Health pattern):
  // majority of sub-categories must individually sum to ~1.0
  var subsNear1 = 0
  for (var i = 0; i < subResults.length; i++) {
    if (Math.abs(subResults[i].sum - TARGET_SUM) <= TOLERANCE) {
      subsNear1++
    }
  }

  if (subsNear1 > subResults.length / 2) {
    // Per-sub-category mode — report each sub that is off
    for (var j = 0; j < subResults.length; j++) {
      var s = subResults[j]
      if (Math.abs(s.sum - TARGET_SUM) > TOLERANCE) {
        _emitError(categoryLabel + ' \u2192 ' + s.label, s.sum)
      } else if (Math.abs(s.sum - TARGET_SUM) > 0.001) {
        gs.addInfoMessage(
          'Metric weight sum for <b>' + categoryLabel + ' \u2192 ' +
          s.label + '</b> is <b>' + _round(s.sum) +
          '</b> (expected 1.0). Close enough but consider adjusting.'
        )
      }
    }
  } else {
    // Category-level mode — report category total
    _emitError(categoryLabel, catSum)
  }

  function _sumWeights(groupField, groupValue) {
    var gr = new GlideRecord('x_maf_core_metric_definition')
    gr.addQuery(groupField, groupValue)
    gr.addQuery('active', true)
    gr.query()
    var sum = 0
    while (gr.next()) {
      sum += parseFloat(gr.getValue('weight_in_category')) || 0
    }
    return sum
  }


  function _round(v) {
    return Math.round(v * 10000) / 10000
  }

  function _emitError(scopeLabel, weightSum) {
    gs.addErrorMessage(
      'Metric weight sum for <b>' + scopeLabel + '</b> is <b>' +
      _round(weightSum) + '</b> \u2014 expected 1.0. Please update the ' +
      'metric weights in this group so they sum to exactly 1.0, ' +
      'otherwise scoring will be skewed.'
    )
  }
})(current, previous)
