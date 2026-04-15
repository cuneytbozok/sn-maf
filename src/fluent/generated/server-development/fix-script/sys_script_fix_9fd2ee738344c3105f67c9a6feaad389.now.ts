import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['9fd2ee738344c3105f67c9a6feaad389'],
    table: 'sys_script_fix',
    data: {
        before: false,
        name: 'MAFWeightNormalizer',
        record_for_rollback: true,
        script: `/**
 * MAFWeightNormalizer — Fix Script
 *
 * Modes:
 *   MODE = 'report'    → only logs current weights and deviations (safe, no changes)
 *   MODE = 'auto'      → proportional scaling with 2-decimal rounding (no AI)
 *   MODE = 'ai'        → sends current weights + metric context to LLM, applies returned weights (The AI mode only triggers when weights are imbalanced (sum ≠ 1.00))
 */

var MODE = 'ai'
var TOLERANCE = 0.005
var TARGET = 1.0

// ── Single output buffer ──
var output = {
  mode: MODE,
  timestamp: new GlideDateTime().getDisplayValue(),
  packs: []
}

var packGr = new GlideRecord('x_maf_core_pack')
packGr.addQuery('active', true)
packGr.query()

while (packGr.next()) {
  var packId = packGr.getUniqueValue()
  var packLabel = packGr.getValue('label') || packGr.getValue('name')
  var packOut = { pack: packLabel, groups: [] }

  var catGr = new GlideRecord('x_maf_core_category')
  catGr.addQuery('pack', packId)
  catGr.orderBy('order')
  catGr.query()

  while (catGr.next()) {
    var catId = catGr.getUniqueValue()
    var catLabel = catGr.getValue('label') || catGr.getValue('name')
    var strategy = _detectStrategy(catId)

    if (strategy === 'per_sub') {
      var subGr = new GlideRecord('x_maf_core_sub_category')
      subGr.addQuery('category', catId)
      subGr.addQuery('active', true)
      subGr.orderBy('order')
      subGr.query()
      while (subGr.next()) {
        var subId = subGr.getUniqueValue()
        var subLabel = subGr.getValue('label') || subGr.getValue('name')
        packOut.groups.push(_processGroup('sub_category', subId, catLabel + ' > ' + subLabel))
      }
    } else {
      packOut.groups.push(_processGroup('category', catId, catLabel))
    }
  }
  output.packs.push(packOut)
}

// ── Single log entry ──
gs.info('MAFWeightNormalizer result:\\n' + JSON.stringify(output, null, 2))


// ═══════════════════════════════════════════════════
// Functions
// ═══════════════════════════════════════════════════

function _detectStrategy(catId) {
  var subGr = new GlideRecord('x_maf_core_sub_category')
  subGr.addQuery('category', catId)
  subGr.addQuery('active', true)
  subGr.query()

  var subs = []
  while (subGr.next()) {
    subs.push(subGr.getUniqueValue())
  }
  if (subs.length <= 1) return 'category'

  var catSum = _readMetrics('category', catId).sum
  if (Math.abs(catSum - TARGET) < TOLERANCE) return 'category'

  var nearCount = 0
  for (var i = 0; i < subs.length; i++) {
    var subSum = _readMetrics('sub_category', subs[i]).sum
    if (Math.abs(subSum - TARGET) < TOLERANCE) nearCount++
  }
  return nearCount > subs.length / 2 ? 'per_sub' : 'category'
}

function _readMetrics(groupField, groupValue) {
  var gr = new GlideRecord('x_maf_core_metric_definition')
  gr.addQuery(groupField, groupValue)
  gr.addQuery('active', true)
  gr.orderBy('name')
  gr.query()

  var metrics = []
  var sum = 0
  while (gr.next()) {
    var w = parseFloat(gr.getValue('weight_in_category')) || 0
    metrics.push({
      sys_id: gr.getUniqueValue(),
      name: gr.getValue('name'),
      label: gr.getValue('label'),
      weight: w,
      collector_type: gr.getValue('collector_type'),
      source_table: gr.getValue('source_table') || '',
      description: (gr.getValue('description') || '').substring(0, 120),
    })
    sum += w
  }
  return { metrics: metrics, sum: Math.round(sum * 100) / 100 }
}

function _processGroup(groupField, groupValue, scopeLabel) {
  var data = _readMetrics(groupField, groupValue)
  var metrics = data.metrics
  var currentSum = data.sum
  var balanced = Math.abs(currentSum - TARGET) < TOLERANCE

  var groupOut = {
    scope: scopeLabel,
    metric_count: metrics.length,
    current_sum: currentSum,
    target: TARGET,
    balanced: balanced,
    metrics: [],
    changes: []
  }

  for (var i = 0; i < metrics.length; i++) {
    groupOut.metrics.push({ name: metrics[i].name, weight: metrics[i].weight })
  }

  if (balanced) {
    groupOut.action = 'none — already balanced'
    return groupOut
  }

  groupOut.deviation = Math.round((currentSum - TARGET) * 100) / 100

  if (MODE === 'report') {
    groupOut.action = 'report only — no changes'
    return groupOut
  }

  var newWeights
  if (MODE === 'ai') {
    newWeights = _getAIWeights(metrics, scopeLabel, groupOut)
  } else {
    newWeights = _getAutoWeights(metrics, currentSum)
  }

  if (!newWeights) {
    groupOut.action = 'skipped — could not compute new weights'
    return groupOut
  }

  var newSum = 0
  for (var v = 0; v < newWeights.length; v++) newSum += newWeights[v].weight
  newSum = Math.round(newSum * 100) / 100

  if (Math.abs(newSum - TARGET) >= TOLERANCE) {
    groupOut.action = 'rejected — proposed sum ' + newSum.toFixed(2) + ' != 1.00'
    return groupOut
  }

  var updated = 0
  for (var u = 0; u < newWeights.length; u++) {
    var nw = newWeights[u]
    var upd = new GlideRecord('x_maf_core_metric_definition')
    if (upd.get(nw.sys_id)) {
      var oldW = parseFloat(upd.getValue('weight_in_category')) || 0
      if (Math.abs(oldW - nw.weight) < 0.001) continue
      upd.setValue('weight_in_category', nw.weight)
      upd.setWorkflow(false)
      upd.update()
      updated++
      groupOut.changes.push({
        name: nw.name,
        from: oldW,
        to: nw.weight,
        reason: nw.reason || ''
      })
    }
  }
  groupOut.action = 'applied ' + updated + ' changes'
  groupOut.new_sum = newSum
  return groupOut
}

function _getAutoWeights(metrics, currentSum) {
  if (currentSum === 0) return null
  var scaleFactor = TARGET / currentSum

  var result = []
  var runningSum = 0
  for (var i = 0; i < metrics.length; i++) {
    var m = metrics[i]
    var scaled = Math.round(m.weight * scaleFactor * 100) / 100
    result.push({ sys_id: m.sys_id, name: m.name, weight: scaled, reason: 'proportional' })
    runningSum += scaled
  }

  runningSum = Math.round(runningSum * 100) / 100
  var diff = Math.round((TARGET - runningSum) * 100) / 100
  if (Math.abs(diff) > 0) {
    var maxIdx = 0
    for (var j = 1; j < result.length; j++) {
      if (result[j].weight > result[maxIdx].weight) maxIdx = j
    }
    result[maxIdx].weight = Math.round((result[maxIdx].weight + diff) * 100) / 100
    result[maxIdx].reason = 'proportional + rounding adjustment'
  }
  return result
}

function _getAIWeights(metrics, scopeLabel, groupOut) {
  var url = String(gs.getProperty('x_maf_core.rest_llm_chat_url', '') || '').trim()
  var apiKey = gs.getProperty('x_maf_core.rest_llm_api_key', '') || ''
  var model = gs.getProperty('x_maf_core.rest_llm_model', 'gpt-4o-mini')

  if (!url) {
    groupOut.ai_fallback = 'no rest_llm_chat_url configured — using auto mode'
    return _getAutoWeights(metrics, metrics.reduce(function (s, m) { return s + m.weight }, 0))
  }

  var metricList = []
  for (var i = 0; i < metrics.length; i++) {
    var m = metrics[i]
    metricList.push({
      sys_id: m.sys_id,
      name: m.name,
      label: m.label,
      current_weight: m.weight,
      collector_type: m.collector_type,
      source_table: m.source_table,
      description: m.description,
    })
  }

  var system =
    'You are an expert ServiceNow ITSM maturity framework architect. ' +
    'You are given a list of metrics in a scoring category with their current weights. ' +
    'The weights must sum to exactly 1.00 (two decimal places). ' +
    'Your job is to redistribute the weights so they sum to 1.00 while preserving the relative importance of each metric.\\n\\n' +
    'RULES:\\n' +
    '1. Weights must use exactly 2 decimal places (e.g., 0.05, 0.12, not 0.051 or 0.1234).\\n' +
    '2. The sum of ALL weights must be EXACTLY 1.00. Verify your math before responding.\\n' +
    '3. Metrics with current_weight = 0 are baselines — keep them at 0.00.\\n' +
    '4. Preserve relative ordering: if metric A had higher weight than metric B, it should still be higher (unless you have a strong reason to change it — explain why).\\n' +
    '5. Consider the metric description, source table, and type when deciding importance.\\n' +
    '6. Core ITSM metrics (incident state, SLA, MTTR) generally deserve higher weights than auxiliary metrics.\\n' +
    '7. For each metric, provide a brief reason for the weight choice.\\n\\n' +
    'RESPONSE FORMAT: Return ONLY a JSON object, no markdown fences, no explanation outside the JSON:\\n' +
    '{"weights": [{"sys_id": "...", "name": "...", "weight": 0.XX, "reason": "brief reason"}, ...], "verification_sum": 1.00}'

  var user =
    'Category: ' + scopeLabel + '\\n' +
    'Current weight sum: ' + metricList.reduce(function (s, m) { return s + m.current_weight }, 0).toFixed(2) + '\\n' +
    'Metrics (' + metricList.length + '):\\n\\n' +
    JSON.stringify(metricList, null, 2)

  var bodyObj = {
    model: model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature: 0.1,
  }

  groupOut.ai_model = model

  try {
    var req = new sn_ws.RESTMessageV2()
    req.setEndpoint(url)
    req.setHttpMethod('post')
    req.setRequestHeader('Content-Type', 'application/json')
    if (String(apiKey).trim() !== '') req.setRequestHeader('Authorization', 'Bearer ' + apiKey)
    req.setHttpTimeout(60000)
    req.setRequestBody(JSON.stringify(bodyObj))

    var res = req.execute()
    var code = res.getStatusCode()
    var respBody = res.getBody()

    if (code < 200 || code >= 300) {
      groupOut.ai_error = 'HTTP ' + code + ': ' + String(respBody).substring(0, 300)
      groupOut.ai_fallback = 'falling back to auto mode'
      return _getAutoWeights(metrics, metrics.reduce(function (s, m) { return s + m.weight }, 0))
    }

    var parsed = JSON.parse(respBody)
    var content = parsed.choices && parsed.choices[0] && parsed.choices[0].message && parsed.choices[0].message.content
    content = String(content || '').trim()
    content = content.replace(/^\`\`\`(?:json)?\\s*/i, '').replace(/\\s*\`\`\`\\s*$/, '')

    var aiResult = JSON.parse(content)
    var aiWeights = aiResult.weights

    if (!aiWeights || !aiWeights.length) {
      groupOut.ai_error = 'LLM returned no weights array'
      groupOut.ai_fallback = 'falling back to auto mode'
      return _getAutoWeights(metrics, metrics.reduce(function (s, m) { return s + m.weight }, 0))
    }

    var result = []
    var verifySum = 0
    for (var j = 0; j < aiWeights.length; j++) {
      var aw = aiWeights[j]
      var rounded = Math.round(parseFloat(aw.weight) * 100) / 100
      result.push({ sys_id: aw.sys_id, name: aw.name, weight: rounded, reason: aw.reason || 'AI adjusted' })
      verifySum += rounded
    }
    verifySum = Math.round(verifySum * 100) / 100
    groupOut.ai_proposed_sum = verifySum

    if (Math.abs(verifySum - TARGET) >= TOLERANCE) {
      var fixDiff = Math.round((TARGET - verifySum) * 100) / 100
      var mIdx = 0
      for (var fi = 1; fi < result.length; fi++) {
        if (result[fi].weight > result[mIdx].weight) mIdx = fi
      }
      result[mIdx].weight = Math.round((result[mIdx].weight + fixDiff) * 100) / 100
      result[mIdx].reason += ' + sum correction'
      groupOut.ai_sum_corrected = true
    }

    return result
  } catch (e) {
    groupOut.ai_error = String(e)
    groupOut.ai_fallback = 'falling back to auto mode'
    return _getAutoWeights(metrics, metrics.reduce(function (s, m) { return s + m.weight }, 0))
  }
}
`,
        unloadable: false,
    },
})
