# MAF Platform Health Pack v1 — PRD

**Status:** Draft
**Author:** (reviewed with Claude)
**Scope:** New assessment pack `platform_health` + prerequisite scoring engine refactor
**Depends on:** `x_maf_core` (existing), ITSM pack v3 (deployed)
**Target release:** TBD

---

## 1. Summary

This PRD specifies the second assessment pack for the MAF (ModernAssess Framework) platform: **Platform Health**. The pack measures whether a ServiceNow instance is healthy and sustainable to operate, independent of any specific process pack (ITSM, HR, CSM, etc.). It is the foundational pack — every future pack benefits from its metrics without modification.

The PRD is structured in three phases:

- **Phase 0 — Scoring engine sub-category refactor.** A prerequisite change to `x_maf_core` that introduces a second level of rollup (metric → sub-category → category → pack). This is specified as a full mini-PRD inside §4 because it must ship *before* Platform Health metrics land, and because deferring it further is no longer viable at current metric volume.
- **Phase 1 — New collector: `MAFSchemaIntrospectionCollector`.** A scoped introspection collector for `sys_db_object`, `sys_dictionary`, `sys_script`, `sys_trigger`, `sys_update_xml`, `sys_update_set`, `syslog`, and a short allowlist of related system tables. Everything else the pack needs can be expressed with the five existing collectors.
- **Phase 2 — Platform Health pack.** A single new category `platform_health`, nine sub-categories, approximately 45–50 metrics, strongly opinionated about deprecations and anti-patterns.

The pack is **strongly opinionated by design**. Partners and customers who disagree with a specific metric's weight or threshold can override it per-customer; the pack does not hedge its defaults. Every metric ships with a populated `description` field stating its rationale.

---

## 2. Goals and non-goals

### 2.1 Goals

- **G1.** Deliver an instance-wide health score that is *not* process-pack-specific and can be run against any ServiceNow instance regardless of which other packs the customer licenses.
- **G2.** Measure signals that OOTB ServiceNow dashboards (`stats.do`, `threads.do`, CMDB Health, Performance Analytics) do not consolidate into a single partner-facing score.
- **G3.** Give partner delivery leads and platform owners a defensible artifact to anchor "your platform is (un)healthy" conversations with customer executives.
- **G4.** Introduce sub-category rollup into the scoring engine so that weight management scales past the ~70-metric point we are already beyond.
- **G5.** Provide one new reusable collector (`MAFSchemaIntrospectionCollector`) that unblocks every future pack needing schema, trigger, update set, or syslog introspection.
- **G6.** Ship ~45–50 Platform Health metrics with populated rationales, strict thresholds on security and anti-pattern sub-categories, and light-touch scoring on raw footprint sub-categories where the signal is noisy.

### 2.2 Non-goals

- **NG1. No trend or historical collectors.** Trend data is already latent in the `x_maf_core_assessment_run` history. Trends will be surfaced in a follow-up reporting layer that reads N most recent runs per customer. Collectors remain strictly point-in-time.
- **NG2. No remediation actions.** This is a measurement pack. It does not run fixes, open tasks, or schedule cleanups. Partners drive remediation manually from the drill-down lists.
- **NG3. No overlap with ITSM v3's "Platform Hygiene" category.** That category stays ITSM-scoped (business rules on `incident`, client scripts on `incident` form, UI policies on `incident` form, catalog-flavored automation ratios). Platform Health is instance-wide. §6.2 specifies the boundary explicitly.
- **NG4. No CMDB/CSDM metrics.** OOTB covers the 3Cs and CSDM workspace maturity; a Platform Health sub-category on CMDB would duplicate that work. A separate future pack may cover CMDB governance gaps that OOTB does not measure, but that is out of scope here.
- **NG5. No new scoring math for individual metrics.** The existing `mafNormalizeHigherIsBetter` / `mafNormalizeLowerIsBetter` / `mafMetricRagFromRaw` helpers are untouched. Phase 0 only changes *rollup*, not normalization.
- **NG6. No backfill of `description` fields on existing ITSM metrics.** A cleanup to populate descriptions on the existing 70 metrics is noted as a follow-up in §9, not blocked by this PRD.

---

## 3. Problem statement and motivation

### 3.1 Why now

Three signals from ITSM v3 tell us we have hit a scaling cliff:

1. **Weight drift is already happening.** At 70 metrics across 5 flat categories, hand-rebalancing `weight_in_category` on metric addition has already failed silently. Current state (measured from `x_maf_core_metric_definition` export, 2026-04-09):
   - `ade90347d5104f2fa94a3b5a3b5f3b31`: 26 metrics, weight sum = **1.05** (over)
   - `c0f44935da5a479b8104c3766cb07cc0`: 12 metrics, weight sum = **0.99** (under)
   - Three other categories sum cleanly to 1.0.

   `MAFScoringEngine.scoreRun` currently divides by `wSum` rather than assuming the weights sum to 1.0, so the category scores are *internally consistent* despite the drift — but the drift means nobody has been enforcing a rebalance on each new metric, and the category with 26 metrics in a single flat bucket is the hardest to maintain. Adding a Platform Health category with ~45 metrics in a single flat bucket on top of this is not survivable.

2. **One category has 26 metrics in a single flat bucket.** The ITSM "Platform Hygiene" category mixes business rule counts, client script counts, UI policy counts, catalog automation ratios, and subflow adoption into one rollup. There is no meaningful way for a reader of the final score to know *which* aspect drove the number. Sub-categories would split these into at minimum three groups (custom code volume, catalog automation, UX policies) and make the rollup interpretable.

3. **Platform Health's natural structure is sub-categorized.** The nine themes in §6.3 — instance performance, data volume & retention, scheduled job health, business rule sanity, update set discipline, plugin & app footprint, email & integration health, security hygiene, logging & error rates — map naturally to sub-categories under a single `platform_health` category. Forcing them into nine sibling categories at the same level as `itsm_incident_management` would be a category-model violation; they are all aspects of one thing.

### 3.2 What OOTB does not cover

ServiceNow ships `stats.do`, `threads.do`, the Slow Query Log, CMDB Health dashboards, and Performance Analytics. None of these produce a single consolidated "is your platform healthy" score at the instance level for a partner-facing conversation. They are diagnostic tools, not assessment artifacts. Platform Health fills this gap by producing a single scored artifact with drill-down lists a partner can walk a customer through in a review meeting.

### 3.3 What partners actually ask for

Partner delivery leads reviewing v3 have consistently asked three questions about the *platform* (not the ITSM process) that the current pack does not answer:

- "Is this customer going to have a performance problem before we finish our next engagement?"
- "Is their admin team following release discipline, or are update sets piling up in dev?"
- "Are they still using deprecated stuff I should flag to the architect?"

These map directly onto the Platform Health sub-categories in §6.3.

---

## 4. Phase 0 — Scoring engine sub-category refactor (mini-PRD)

This section is a full mini-PRD. It ships independently of Phases 1 and 2 and does not change any currently-computed score.

### 4.1 Objective

Introduce a second level of weight rollup between metric and category, so that:

- A category contains one or more sub-categories.
- A sub-category contains one or more metrics.
- Metric weights sum within sub-category (not across category).
- Sub-category weights sum within category.
- The final category score is a weighted average of sub-category scores.

All three rollups tolerate non-unity weight sums via the same "divide by sum of weights" approach currently used in `MAFScoringEngine.scoreRun`.

### 4.2 Schema changes

#### 4.2.1 New table: `x_maf_core_sub_category`

| Field | Type | Notes |
|---|---|---|
| `sys_id` | GUID | Standard |
| `name` | String (40) | Machine name, e.g. `platform_security_hygiene` |
| `label` | String (80) | Display name, e.g. "Security hygiene" |
| `category` | Reference → `x_maf_core_category` | Mandatory |
| `weight_in_category` | Decimal (5,3) | Default 1.0; sum within category not required to equal 1.0 |
| `order` | Integer | Display ordering |
| `description` | String (4000) | Rationale for the sub-category's existence |
| `active` | Boolean | Default true |

#### 4.2.2 Changes to `x_maf_core_metric_definition`

| Field | Change | Notes |
|---|---|---|
| `sub_category` | **New field**, Reference → `x_maf_core_sub_category` | Nullable for a transition period (see §4.4); mandatory after migration completes |
| `weight_in_category` | **Renamed** to `weight_in_sub_category` | Semantic rename; no data change |
| `category` | **Unchanged** | Kept for backward compatibility and to make reports work during transition; becomes derivable from `sub_category.category` after migration |

**Important:** the rename is a display-label change plus a code rename; the underlying column name in the database can stay `weight_in_category` if renaming columns is disruptive. The PRD uses `weight_in_sub_category` as the logical name. Implementation can pick either.

#### 4.2.3 New table: `x_maf_core_sub_category_score`

Mirrors `x_maf_core_category_score` structure, one row per (assessment_run, sub_category).

| Field | Type | Notes |
|---|---|---|
| `assessment_run` | Reference → `x_maf_core_assessment_run` | |
| `sub_category` | Reference → `x_maf_core_sub_category` | |
| `score` | Decimal (5,2) | 0–100 |
| `rag_status` | Choice: green/amber/red | Same thresholds as category |
| `metrics_total` | Integer | |
| `metrics_green` | Integer | |
| `metrics_amber` | Integer | |
| `metrics_red` | Integer | |
| `metrics_error` | Integer | |

#### 4.2.4 Changes to `x_maf_core_category_score`

No schema change. Semantics change: the category score is now a weighted average of *sub-category scores*, not metric scores directly.

### 4.3 `MAFScoringEngine.scoreRun` — rewrite specification

The current `scoreRun` iterates metric results joined to category and computes one weighted average. The new version does two passes.

**Pseudocode** (mirrors existing style, same `mafRound2` and `wSum`-tolerant approach):

```javascript
scoreRun: function (runSysId) {
  var run = new GlideRecord('x_maf_core_assessment_run')
  if (!run.get(runSysId)) return

  // 1. Clean slate
  var delSub = new GlideRecord('x_maf_core_sub_category_score')
  delSub.addQuery('assessment_run', runSysId)
  delSub.query()
  delSub.deleteMultiple()

  var delCat = new GlideRecord('x_maf_core_category_score')
  delCat.addQuery('assessment_run', runSysId)
  delCat.query()
  delCat.deleteMultiple()

  var packsRaw = run.getValue('packs')
  if (!packsRaw) return
  var packIds = this._parsePackIds(packsRaw)
  if (packIds.length === 0) return

  var greenTh = parseInt(gs.getProperty('x_maf_core.score_threshold_green', '75'), 10) || 75
  var amberTh = parseInt(gs.getProperty('x_maf_core.score_threshold_amber', '50'), 10) || 50

  // 2. First pass: sub-category scores from metric results
  var subCatAggregates = {}  // keyed by sub_category sys_id

  var mr = new GlideRecord('x_maf_core_metric_result')
  mr.addQuery('assessment_run', runSysId)
  mr.query()
  while (mr.next()) {
    var mdId = mr.getValue('metric_definition')
    var mdGR = new GlideRecord('x_maf_core_metric_definition')
    if (!mdGR.get(mdId)) continue

    var subCatId = mdGR.getValue('sub_category')
    if (!subCatId) continue   // transition period: metric not yet migrated; skip from rollup

    if (!subCatAggregates[subCatId]) {
      subCatAggregates[subCatId] = {
        wSum: 0, weighted: 0,
        total: 0, green: 0, amber: 0, red: 0, error: 0
      }
    }
    var agg = subCatAggregates[subCatId]
    agg.total++

    var rs = mr.getValue('rag_status')
    if (rs === 'error') { agg.error++; continue }
    if (rs === 'green') agg.green++
    else if (rs === 'amber') agg.amber++
    else if (rs === 'red') agg.red++

    var w = parseFloat(mdGR.getValue('weight_in_sub_category'))
    if (isNaN(w) || w === 0) continue
    var ns = parseFloat(mr.getValue('normalized_score'))
    if (isNaN(ns)) continue
    agg.weighted += ns * w
    agg.wSum += w
  }

  // 3. Write sub-category scores and build category aggregates
  var catAggregates = {}  // keyed by category sys_id

  var subGr = new GlideRecord('x_maf_core_sub_category')
  subGr.addQuery('category.pack', 'IN', packIds.join(','))
  subGr.addQuery('active', true)
  subGr.query()
  while (subGr.next()) {
    var subId = subGr.getUniqueValue()
    var catId = subGr.getValue('category')
    var agg = subCatAggregates[subId]

    if (!agg || agg.total === 0) {
      // No metric results for this sub-category in this run; skip
      continue
    }

    var subScore = agg.wSum > 0 ? mafRound2(agg.weighted / agg.wSum) : 0
    var subRag = subScore >= greenTh ? 'green'
               : subScore >= amberTh ? 'amber' : 'red'

    var cs = new GlideRecord('x_maf_core_sub_category_score')
    cs.initialize()
    cs.setValue('assessment_run', runSysId)
    cs.setValue('sub_category', subId)
    cs.setValue('score', subScore)
    cs.setValue('rag_status', subRag)
    cs.setValue('metrics_total', agg.total)
    cs.setValue('metrics_green', agg.green)
    cs.setValue('metrics_amber', agg.amber)
    cs.setValue('metrics_red', agg.red)
    cs.setValue('metrics_error', agg.error)
    cs.insert()

    // Accumulate into category
    if (!catAggregates[catId]) {
      catAggregates[catId] = {
        wSum: 0, weighted: 0,
        total: 0, green: 0, amber: 0, red: 0, error: 0
      }
    }
    var cAgg = catAggregates[catId]
    var subW = parseFloat(subGr.getValue('weight_in_category'))
    if (isNaN(subW) || subW === 0) subW = 0  // excluded from rollup but still written above
    cAgg.weighted += subScore * subW
    cAgg.wSum += subW
    cAgg.total += agg.total
    cAgg.green += agg.green
    cAgg.amber += agg.amber
    cAgg.red += agg.red
    cAgg.error += agg.error
  }

  // 4. Write category scores
  var catGr = new GlideRecord('x_maf_core_category')
  catGr.addQuery('pack', 'IN', packIds.join(','))
  catGr.query()
  while (catGr.next()) {
    var catId = catGr.getUniqueValue()
    var cAgg = catAggregates[catId]
    if (!cAgg) continue

    var catScore = cAgg.wSum > 0 ? mafRound2(cAgg.weighted / cAgg.wSum) : 0
    var catRag = catScore >= greenTh ? 'green'
               : catScore >= amberTh ? 'amber' : 'red'

    var cs2 = new GlideRecord('x_maf_core_category_score')
    cs2.initialize()
    cs2.setValue('assessment_run', runSysId)
    cs2.setValue('category', catId)
    cs2.setValue('score', catScore)
    cs2.setValue('rag_status', catRag)
    cs2.setValue('metrics_total', cAgg.total)
    cs2.setValue('metrics_green', cAgg.green)
    cs2.setValue('metrics_amber', cAgg.amber)
    cs2.setValue('metrics_red', cAgg.red)
    cs2.setValue('metrics_error', cAgg.error)
    cs2.insert()
  }
}
```

**Key properties of this rewrite:**

- **Backward compatible during transition.** If `sub_category` is null on a metric definition, the metric still runs and produces a `metric_result` row, but it is excluded from the sub-category and category rollup. This lets the refactor ship before all existing metrics are migrated. §4.4 below specifies the migration.
- **`wSum`-tolerant at both levels.** Weight sums within sub-category and sub-category weights within category do not need to equal 1.0; the rollup always divides by the actual sum of non-zero weights encountered. This is identical to the current behavior at one level and avoids the "broken score if weights drift by 0.01" failure mode.
- **Same RAG threshold logic.** Green/amber thresholds (`x_maf_core.score_threshold_green`, `x_maf_core.score_threshold_amber`) are applied to both sub-category scores and category scores unchanged.
- **Same "delete then insert" pattern.** Both `x_maf_core_sub_category_score` and `x_maf_core_category_score` are wiped for the run before recomputation, matching the existing behavior.

### 4.4 Migration plan for the 70 existing ITSM metrics

The refactor ships in a specific order to avoid a window where scores are broken:

**Step 1. Schema deployment (update set A).**
- Create `x_maf_core_sub_category` table.
- Create `x_maf_core_sub_category_score` table.
- Add `sub_category` field to `x_maf_core_metric_definition` (nullable).
- No code changes. Existing `scoreRun` continues to use flat category rollup because there are no sub-categories yet.

**Step 2. Code deployment (update set B).**
- Replace `MAFScoringEngine.scoreRun` with the two-pass version above.
- At this point, no metric has a `sub_category` set, so the first pass produces zero sub-category aggregates, the second pass writes zero sub-category score rows, and the third pass writes zero category score rows.
- **This would break all ITSM scores.** Therefore update set B is **not** deployed until step 3 completes.

**Step 3. Data migration (update set C, deployed before B).**
- Create nine sub-categories for ITSM, one per logical grouping already implicit in the current data. Proposed mapping (subject to confirmation during implementation):
  - Category `Incident Management` → sub-categories `incident_data_quality`, `incident_resolution_performance`, `incident_major_incident`
  - Category `Problem Management` → sub-category `problem_lifecycle` (single, 4 metrics)
  - Category `Change Management` → sub-category `change_governance` (single, 6 metrics)
  - Category `Service Catalog` → sub-categories `catalog_content_quality`, `catalog_automation`, `catalog_variables`
  - Category `Platform Hygiene (ITSM-scoped)` → sub-categories `itsm_custom_code`, `itsm_notifications_and_workflow`, `itsm_sla_and_assignment`
- Each existing metric gets assigned to one sub-category via a data-only update.
- Sub-category weights default to 1.0 within each category (i.e. equal split) and are tuned by hand after the first test run.
- No metric's `weight_in_sub_category` changes value during migration — only its semantic meaning (from "weight within 26-metric flat bucket" to "weight within ~8-metric sub-category"). This causes scores to shift numerically on first run after migration; §4.5 addresses this.

**Step 4. Deploy update set B (code).**
- Now every metric has a `sub_category` populated, the new `scoreRun` rolls up correctly, and category scores are comparable to (but not identical to) pre-migration scores.

**Step 5. Regression test and weight tuning.**
- Run a fresh assessment against the reference test instance.
- Compare category scores pre- and post-migration. Differences are expected but should be within ±5 points per category after sub-category weights are tuned.
- Adjust sub-category weights within each category until differences are acceptable. Document the final weights.
- Mark `sub_category` field as mandatory on `x_maf_core_metric_definition` going forward (business rule enforcement, not schema change).

### 4.5 Score continuity

Migration *will* shift category scores, because flat-weighted averages and two-level-weighted averages are not mathematically equivalent unless the sub-category weights perfectly compensate for the per-metric weights. This is acceptable and expected. Mitigations:

- **Communicate the shift.** Any partner with open engagements should be told "we are migrating to a sub-category model; scores will shift by up to 5 points on the next run" before update set C lands.
- **Tune for continuity, not purity.** The first-run goal is small drift from the pre-migration score. Long-term, sub-category weights can be tuned for *meaning* rather than continuity.
- **Archive pre-migration run.** Before step 3, run a final assessment against each active customer instance and archive the `x_maf_core_assessment_run` row so that the pre-migration score is preserved for comparison.

### 4.6 Test fixtures

Phase 0 ships with a new test fixture file `MAFCollectorTestFixtures` additions (or a new `MAFScoringEngineTestFixtures` script include, if that's the existing convention — TBD during implementation):

| Fixture | Shape | Validates |
|---|---|---|
| `emptyRun` | Assessment run with no metric results | Rollup writes zero rows, does not crash |
| `singleSubCategory` | 1 category, 1 sub-category, 3 metrics with known scores | Sub-category score is correct weighted average; category score equals sub-category score |
| `multiSubCategory` | 1 category, 3 sub-categories, varying metric counts | Category score is weighted average of sub-category scores |
| `weightDrift` | Sub-category with metric weights summing to 0.97 | `wSum` divisor produces sensible score, not NaN |
| `zeroWeightDrift` | Sub-category with all metric weights = 0 | Score is 0, no division by zero |
| `nullSubCategory` | Metric definition with `sub_category` = null | Metric is excluded from rollup, no rollup row written |
| `errorMetrics` | Sub-category with 2 metrics in error state, 3 green | Error count propagates; errored metrics excluded from weighted sum |
| `mixedRag` | Sub-category with known mix of green/amber/red | Per-sub-category counters accurate |
| `threshold boundary` | Sub-category score exactly at green threshold | RAG assignment at boundary is deterministic (≥ vs >) |

These fixtures are run as unit tests against the pure normalization helpers in `src/pure/mafNormalize.js` where possible, and as ATF tests against the scoring engine in-instance where GlideRecord is required.

### 4.7 Phase 0 acceptance criteria

- [ ] Schema update set A deployed; no code change yet; existing scores still computed via flat rollup because no sub-categories exist.
- [ ] Sub-categories created for all nine ITSM groupings; all 70 metrics assigned to a sub-category; sub-category weights documented.
- [ ] Archived pre-migration assessment runs exist for every active customer instance.
- [ ] Update sets B (code) and C (data) deployed in order; first post-migration assessment run produces category scores within ±5 points of the archived run on the reference test instance after sub-category weight tuning.
- [ ] All nine test fixtures pass.
- [ ] `MAFScoringEngine.scoreRun` `wSum`-divides at both levels and handles null `sub_category`, zero weights, and empty runs without throwing.
- [ ] `x_maf_core_sub_category_score` is populated on every post-Phase-0 run for every active sub-category with at least one non-error metric result.

---

## 5. Phase 1 — `MAFSchemaIntrospectionCollector`

### 5.1 Purpose

Platform Health needs to query ServiceNow system tables that are not reachable via the existing collectors without either (a) special-casing each metric as a bespoke script include, or (b) allowing arbitrary-table queries from the declarative collector, which is a security and maintainability problem.

The new collector introspects a fixed allowlist of schema and log tables via the standard `script_params` contract, and exposes aggregation patterns that the existing collectors cannot express cleanly:

- "Count tables in `sys_db_object` whose row count exceeds N on the target instance."
- "Count business rules on a given table that share the same `order` value (collision detection)."
- "Count update sets in `sys_update_set` with state=`in_progress` and `sys_updated_on` older than 30 days."
- "Count rows in `syslog` with `level=error` in the last N hours."

### 5.2 Why this is a new collector, not an extension of `MAFDeclarativeCollector`

The declarative collector permits `source_table` to be any table by design — which is fine for process-pack metrics where the tables are well-known (`incident`, `change_request`, etc.) and the metric author has deliberately chosen them. Platform Health metrics that want to query `sys_script`, `sys_trigger`, `syslog`, etc. *could* be expressed with the declarative collector, and some of them will be (see §6.4 for which). But two classes of metric cannot:

1. **Metrics that need to detect duplicates or collisions within a table.** For example, "business rules on the same table with the same `order`" is not a filter-and-count; it's a group-by-and-count-greater-than-one. The declarative collector does not support group-by.
2. **Metrics that need to count distinct tables matching a property of the table itself.** For example, "tables in `sys_db_object` with row count over 1 million" requires either (a) reading `sys_db_object` and then running a count query against each row's named table (N+1), or (b) reading a materialized stats table if one exists on the instance. The declarative collector does not support either pattern.

A dedicated collector with a tight allowlist is the cleanest way to express these without exposing a general-purpose "run arbitrary SQL" escape hatch.

### 5.3 Table allowlist

The collector only permits queries against the following tables. Requests for any other table return a clear error without executing.

| Table | Purpose |
|---|---|
| `sys_db_object` | Table metadata (name, label, extends) |
| `sys_dictionary` | Column metadata (used for "tables with no active archive rule" type queries) |
| `sys_script` | Business rules |
| `sys_script_client` | Client scripts (instance-wide; ITSM pack restricts by form) |
| `sys_ui_policy` | UI policies (instance-wide) |
| `sys_trigger` | Scheduled jobs |
| `sys_update_set` | Update sets |
| `sys_update_xml` | Update set contents (for "update sets with N changes" type queries) |
| `sys_user` | Users (for security hygiene metrics — inactive admins, etc.) |
| `sys_user_has_role` | Role assignments |
| `sys_security_acl` | ACLs |
| `sys_security_acl_role` | ACL-to-role mapping |
| `sys_rest_message` | Outbound REST message definitions |
| `sys_rest_message_fn` | REST message methods (for auth type introspection) |
| `sys_email` | Email sysauto (for delivery failure metrics) |
| `sysevent` | Event queue |
| `sysevent_register` | Event registrations |
| `sys_app` | Scoped applications |
| `v_plugin` | Plugins (view; read-only) |
| `syslog` | System log (read-only; bounded by time window) |
| `sys_transaction_pattern` | Slow transaction patterns (if available on instance) |
| `sys_audit` | Audit log (read-only; bounded by time window) |

Queries against `syslog`, `sys_audit`, and `sys_transaction_pattern` **must** include a time window in `script_params` (default 24h, max 7d). Queries without a time window are rejected to prevent full-table scans on high-volume log tables.

### 5.4 Operation modes

`MAFSchemaIntrospectionCollector` supports four operation modes selected via `script_params.mode`:

#### 5.4.1 `mode: "count"`

Simplest mode. Count rows in an allowlisted table matching a filter.

```json
{
  "mode": "count",
  "table": "sys_trigger",
  "filter": "state=error^next_action>=javascript:gs.daysAgoStart(7)"
}
```

Returns the numeric count. Behaves like `MAFDeclarativeCollector` `count` aggregation but against allowlisted tables only.

**Note:** simple counts against allowlisted tables *can* also be expressed with `MAFDeclarativeCollector` pointing at the same table. Either is acceptable; prefer the declarative collector for simple counts and reserve `MAFSchemaIntrospectionCollector` for modes below that the declarative collector cannot express.

#### 5.4.2 `mode: "group_collision"`

Count groups in a table where a `group_by` field has more than `min_group_size` rows sharing the same value. Used for "business rules with duplicate order on the same table" and similar collision metrics.

```json
{
  "mode": "group_collision",
  "table": "sys_script",
  "filter": "active=true^when=before",
  "group_by": "collection,order",
  "min_group_size": 2
}
```

Implementation: `GlideAggregate` with group-by on the listed fields, `addAggregate('COUNT', null)`, then a `having` filter (client-side in the collector because `GlideAggregate.addHaving` is not consistently available) to keep only groups with count ≥ `min_group_size`. Returns the number of such groups.

#### 5.4.3 `mode: "row_count_over_threshold"`

For each row in a metadata table, run a count query against the table named by that row, and return the number of rows whose count exceeds a threshold. Used for "tables over 1 million rows."

```json
{
  "mode": "row_count_over_threshold",
  "metadata_table": "sys_db_object",
  "metadata_filter": "super_class=NULL^name!STARTSWITHsys_",
  "metadata_name_field": "name",
  "row_threshold": 1000000,
  "max_tables_scanned": 500
}
```

**Safety:** this mode is N+1 by design. `max_tables_scanned` caps the number of count queries executed per metric run. If the metadata query returns more rows than the cap, the collector returns an error rather than silently truncating.

#### 5.4.4 `mode: "windowed_count"`

Count rows in `syslog`, `sys_audit`, or `sys_transaction_pattern` within a time window. Window is mandatory for these tables.

```json
{
  "mode": "windowed_count",
  "table": "syslog",
  "filter": "level=error",
  "window_field": "sys_created_on",
  "window_hours": 24
}
```

### 5.5 Error contract

Matches the existing collector base:

```json
{ "value": null, "drillDownTable": "...", "drillDownQuery": "...", "error": "reason" }
```

Errors include:
- Table not in allowlist
- Required `mode` parameter missing or not recognized
- Mode-specific required params missing (e.g. `group_by` for `group_collision`)
- `max_tables_scanned` exceeded in `row_count_over_threshold`
- Time window missing or exceeds max for log tables
- Glide query failure

### 5.6 Security considerations

- **Allowlist is hard-coded in the script include**, not a system property, not a table. Changing the allowlist requires an update set, which is auditable.
- **No dynamic SQL, no dynamic table names from user input.** The `table` parameter is validated against the allowlist before any Glide call.
- **No write operations.** The collector is strictly read-only by construction (only `GlideRecord.query` and `GlideAggregate.query` are called; no `insert`, `update`, `delete`).
- **Runs in the same scope as other collectors** (`x_maf_core`), under the same role-gated access as the rest of the MAF framework. No elevated privileges requested.

### 5.7 Phase 1 acceptance criteria

- [ ] `MAFSchemaIntrospectionCollector` script include deployed in `x_maf_core`, extending `MAFMetricCollectorBase`.
- [ ] All four modes implemented with the `script_params` contract above.
- [ ] Allowlist enforcement: requests for non-allowlisted tables return an error with `value: null`.
- [ ] `max_tables_scanned` cap enforced in `row_count_over_threshold` mode.
- [ ] Time window mandatory for `syslog`, `sys_audit`, `sys_transaction_pattern`.
- [ ] `MAFCollectorFactory` can resolve the new collector class via the same mechanism as existing collectors (no factory changes expected).
- [ ] Unit tests for each mode against `MAFCollectorTestFixtures`.
- [ ] At least one end-to-end metric definition in Phase 2 uses each of the four modes.

---

## 6. Phase 2 — Platform Health pack

### 6.1 Category and sub-category structure

One new category `platform_health` with nine sub-categories.

| Sub-category machine name | Label | Metric count (target) | Sub-category weight |
|---|---|---|---|
| `platform_performance` | Instance performance | 5 | 0.12 |
| `platform_data_volume` | Data volume & retention | 5 | 0.10 |
| `platform_scheduled_jobs` | Scheduled job health | 5 | 0.10 |
| `platform_business_rules` | Business rule sanity | 5 | 0.12 |
| `platform_update_sets` | Update set discipline | 5 | 0.10 |
| `platform_footprint` | Plugin & app footprint | 5 | 0.06 |
| `platform_email_integration` | Email & integration health | 5 | 0.10 |
| `platform_security` | Security hygiene | 6 | 0.20 |
| `platform_logging_errors` | Logging & error rates | 5 | 0.10 |
| **Total** | | **46** | **1.00** |

Sub-category weight rationale:
- **Security hygiene (0.20)** — highest weight. This is the sub-category where "strongly opinionated" matters most; the cost of a miss is a security incident.
- **Instance performance (0.12)** and **business rule sanity (0.12)** — joint second. These are the most visible symptoms of platform rot and the most likely to be raised by platform owners.
- **Data volume, scheduled jobs, update sets, email/integration, logging (0.10 each)** — standard weight. Each is a clear signal but none is decisive on its own.
- **Plugin & app footprint (0.06)** — intentionally low. As discussed, footprint is context, not judgment. The metrics exist so partners can see the shape of the instance, not to drive the score.

Weights sum to 1.00 but the `wSum` tolerance means small drift during maintenance is acceptable.

### 6.2 Boundary with ITSM "Platform Hygiene"

The ITSM v3 "Platform Hygiene" category contains 26 metrics that look platform-flavored but are scoped to ITSM tables. To avoid double-counting, the following rules apply:

| Signal | ITSM Platform Hygiene scope | Platform Health scope |
|---|---|---|
| Business rules | On `incident`, `change_request`, `problem` tables only | Instance-wide except ITSM tables |
| Client scripts | On `incident`, `change_request`, `problem` forms only | Not measured (too noisy instance-wide) |
| UI policies | On `incident` form only | Not measured (too noisy instance-wide) |
| Catalog automation (flow vs workflow) | `sc_cat_item` scope | Not measured (stays in ITSM) |
| Notifications | ITSM tables | Instance-wide except ITSM tables |
| Assignment rules | ITSM tables | Not measured (low signal outside ITSM) |
| Update sets | Not measured in ITSM | **Platform Health exclusive** |
| Scheduled jobs | Not measured in ITSM | **Platform Health exclusive** |
| Plugins, apps, footprint | Not measured in ITSM | **Platform Health exclusive** |
| Security (users, roles, ACLs) | Not measured in ITSM | **Platform Health exclusive** |
| Performance, logging, syslog | Not measured in ITSM | **Platform Health exclusive** |

The "Instance-wide except ITSM tables" rule is enforced in the metric's `filter_condition` by excluding `collection` (for `sys_script`) or `table` (for `sys_script_client`, `sys_ui_policy`) values in the ITSM tables list. The list of ITSM tables to exclude is a comment in each relevant metric's `description` so a future editor can see exactly why the exclusion exists.

### 6.3 Metric definitions

Every metric below specifies: sub-category, label, collector, key parameters, thresholds, target, `higher_is_better`, weight in sub-category, and a 1–2 sentence rationale (to populate `description`).

All thresholds assume a mid-size customer instance (500–5000 users, 1–5M tasks). Large and small customers will want threshold overrides; this is the default opinionated starting point.

#### 6.3.1 Instance performance — `platform_performance` (5 metrics, weight 0.12)

**P-PERF-01 — Slow transaction count (24h)**
- Collector: `MAFSchemaIntrospectionCollector` mode `windowed_count`
- Params: `table=sys_transaction_pattern`, `filter=response_time>5000`, `window_field=sys_created_on`, `window_hours=24`
- Thresholds: red ≥ 500, amber ≥ 100, target ≤ 10
- Higher is better: **false**; weight 0.25
- Rationale: Transactions taking >5s indicate queries, scripts, or integrations that will only get worse under load. Count is windowed to the last 24h to reflect current state, not lifetime accumulation.

**P-PERF-02 — Long-running scheduled jobs (last 7 days)**
- Collector: `MAFSchemaIntrospectionCollector` mode `count`
- Params: `table=sys_trigger`, `filter=last_run_duration>3600^state!=ready`
- Thresholds: red ≥ 20, amber ≥ 5, target = 0
- Higher is better: **false**; weight 0.20
- Rationale: A scheduled job exceeding one hour of wall-clock is almost always either badly written, running against a table that has outgrown it, or stuck. Zero is the correct target.

**P-PERF-03 — Jobs stuck in "running" state**
- Collector: `MAFSchemaIntrospectionCollector` mode `count`
- Params: `table=sys_trigger`, `filter=state=running^sys_updated_on<javascript:gs.hoursAgoStart(2)`
- Thresholds: red ≥ 3, amber ≥ 1, target = 0
- Higher is better: **false**; weight 0.20
- Rationale: Any scheduled job that has been in the `running` state for more than two hours is almost certainly dead and blocking its own queue slot. Non-zero values here are an operational incident waiting to happen.

**P-PERF-04 — Semaphore exhaustion events (24h)**
- Collector: `MAFSchemaIntrospectionCollector` mode `windowed_count`
- Params: `table=syslog`, `filter=levelLIKEsemaphore^ORmessageLIKEsemaphore exhausted`, `window_hours=24`
- Thresholds: red ≥ 10, amber ≥ 1, target = 0
- Higher is better: **false**; weight 0.15
- Rationale: Semaphore exhaustion is the clearest signal that an instance is under-provisioned or that a runaway process is consuming worker threads. Any occurrence is worth investigating.

**P-PERF-05 — Transaction log error rate (24h, % of total transactions)**
- Collector: `MAFWindowedRatioCollector`
- Params: `table=syslog_transaction`, `numerator_filter=error_message!=NULL`, `denominator_filter=`, `window_field=sys_created_on`, `window_days=1`
- Thresholds: red ≥ 2.0%, amber ≥ 0.5%, target ≤ 0.1%
- Higher is better: **false**; weight 0.20
- Rationale: Transaction-level error rate is the single best "how healthy is this instance right now" metric because it aggregates every failure path (script errors, integration failures, ACL denials). Anything above 0.5% is abnormal.

#### 6.3.2 Data volume & retention — `platform_data_volume` (5 metrics, weight 0.10)

**P-DATA-01 — Tables over 10M rows**
- Collector: `MAFSchemaIntrospectionCollector` mode `row_count_over_threshold`
- Params: `metadata_table=sys_db_object`, `metadata_filter=super_class=NULL^name!STARTSWITHsys_^name!STARTSWITHts_`, `metadata_name_field=name`, `row_threshold=10000000`, `max_tables_scanned=500`
- Thresholds: red ≥ 5, amber ≥ 2, target ≤ 1
- Higher is better: **false**; weight 0.25
- Rationale: Tables over 10M rows are almost always either (a) a log/audit/journal table without a retention policy, or (b) a custom table that has outgrown its design. Either needs attention. The system-table exclusions prevent false positives on tables ServiceNow manages.

**P-DATA-02 — `sys_email` row count**
- Collector: `MAFDeclarativeCollector`
- Params: `source_table=sys_email`, `aggregation=count`
- Thresholds: red ≥ 5,000,000, amber ≥ 1,000,000, target ≤ 500,000
- Higher is better: **false**; weight 0.20
- Rationale: `sys_email` is the single most common offender for unbounded growth because the default retention policy is "forever." A healthy instance rotates this table.

**P-DATA-03 — `sys_audit` row count**
- Collector: `MAFDeclarativeCollector`
- Params: `source_table=sys_audit`, `aggregation=count`
- Thresholds: red ≥ 50,000,000, amber ≥ 10,000,000, target ≤ 5,000,000
- Higher is better: **false**; weight 0.15
- Rationale: `sys_audit` is the second most common runaway table. Thresholds are higher than `sys_email` because audit data is genuinely valuable for compliance and is often rotated less aggressively by choice.

**P-DATA-04 — `sys_history_line` row count**
- Collector: `MAFDeclarativeCollector`
- Params: `source_table=sys_history_line`, `aggregation=count`
- Thresholds: red ≥ 50,000,000, amber ≥ 10,000,000, target ≤ 5,000,000
- Higher is better: **false**; weight 0.15
- Rationale: History and journal entries grow with every task update. Without a rotation job, this table eventually dominates instance size.

**P-DATA-05 — Tables without active archive rule (top-20 largest)**
- Collector: `MAFSchemaIntrospectionCollector` mode `row_count_over_threshold` with a post-filter
- Params: as P-DATA-01 but with `row_threshold=1000000` and an additional allowlisted check against `sys_archive` for matching records
- Thresholds: red ≥ 10, amber ≥ 3, target ≤ 1
- Higher is better: **false**; weight 0.25
- Rationale: A table over 1M rows without an archive rule is an unbounded growth risk. Many instances have one or two by design; more than three is a signal the team is not thinking about retention.

#### 6.3.3 Scheduled job health — `platform_scheduled_jobs` (5 metrics, weight 0.10)

**P-JOB-01 — Jobs with error in last 7 days**
- Collector: `MAFSchemaIntrospectionCollector` mode `count`
- Params: `table=sys_trigger`, `filter=state=error^sys_updated_on>=javascript:gs.daysAgoStart(7)`
- Thresholds: red ≥ 20, amber ≥ 5, target = 0
- Higher is better: **false**; weight 0.25
- Rationale: An errored scheduled job is by definition not doing its work. Even one errored job is worth investigating; more than five is operational neglect.

**P-JOB-02 — Jobs running as System Administrator**
- Collector: `MAFSchemaIntrospectionCollector` mode `count`
- Params: `table=sys_trigger`, `filter=run_as.user_name=admin^system_id=ISEMPTY`
- Thresholds: red ≥ 50, amber ≥ 20, target ≤ 5
- Higher is better: **false**; weight 0.20
- Rationale: Scheduled jobs running as `admin` are a security and auditability smell. Most jobs should run as a dedicated integration user or as the `system` user. Hard to get to zero on many instances, so the target is forgiving.

**P-JOB-03 — Jobs with no description**
- Collector: `MAFSchemaIntrospectionCollector` mode `count`
- Params: `table=sys_trigger`, `filter=description=NULL^system_id=ISEMPTY`
- Thresholds: red ≥ 30, amber ≥ 10, target ≤ 3
- Higher is better: **false**; weight 0.15
- Rationale: A scheduled job with no description is a job nobody can safely disable, because the next admin doesn't know what it does. This is a discipline metric; opinions vary but the right answer is "you should document your cron jobs."

**P-JOB-04 — Jobs with `next_action` in the past**
- Collector: `MAFSchemaIntrospectionCollector` mode `count`
- Params: `table=sys_trigger`, `filter=next_actionRELATIVELT@second@ago@3600^state=ready`
- Thresholds: red ≥ 5, amber ≥ 1, target = 0
- Higher is better: **false**; weight 0.20
- Rationale: A job in `ready` state whose next action is more than an hour in the past is stuck — either the scheduler is behind or the job is misconfigured. Either way, it's not running when it should be.

**P-JOB-05 — Average job runtime above expected threshold (last 7 days)**
- Collector: `MAFSchemaIntrospectionCollector` mode `group_collision`
- Params: `table=sys_trigger`, `filter=state=ready^last_run_duration>0`, `group_by=name`, `min_group_size=1` (returns count of named jobs where last_run_duration > 300 seconds)

  *Note: this metric may be better expressed as a custom script include wrapping the introspection collector; final form is an implementation detail.*
- Thresholds: red ≥ 30, amber ≥ 10, target ≤ 3
- Higher is better: **false**; weight 0.20
- Rationale: Jobs that routinely take more than 5 minutes to complete are either doing too much, scanning too large a table, or blocked. This metric surfaces the count; drill-down shows which.

#### 6.3.4 Business rule sanity — `platform_business_rules` (5 metrics, weight 0.12)

**P-BR-01 — `before` business rules making HTTP calls**
- Collector: `MAFSchemaIntrospectionCollector` mode `count`
- Params: `table=sys_script`, `filter=when=before^active=true^scriptLIKERESTMessage^ORscriptLIKEGlideHTTPRequest`
- Thresholds: red ≥ 1, amber = 0 (any occurrence is red), target = 0
- Higher is better: **false**; weight 0.30
- Rationale: Synchronous HTTP from a `before` business rule blocks the user transaction on a network round-trip and is one of the top three causes of "the instance feels slow" complaints. There is no legitimate reason to do this. Non-zero is red.

**P-BR-02 — Business rules with duplicate order on the same table**
- Collector: `MAFSchemaIntrospectionCollector` mode `group_collision`
- Params: `table=sys_script`, `filter=active=true^when=before`, `group_by=collection,when,order`, `min_group_size=2`
- Thresholds: red ≥ 10, amber ≥ 3, target ≤ 1
- Higher is better: **false**; weight 0.20
- Rationale: Two business rules on the same table with the same order and the same phase have nondeterministic execution order. This is a maintainability landmine. Some low count is tolerable (default OOTB + customer rule can collide), but a pattern of it indicates sloppy change management.

**P-BR-03 — Active async business rules count**
- Collector: `MAFDeclarativeCollector`
- Params: `source_table=sys_script`, `filter_condition=active=true^when=async`, `aggregation=count`
- Thresholds: red ≥ 500, amber ≥ 200, target ≤ 100
- Higher is better: **false**; weight 0.15
- Rationale: Async business rules are *better* than sync equivalents but too many of them indicates a team that uses BRs as a catch-all instead of Flow Designer. Count is a footprint signal, not a failure.

**P-BR-04 — Business rules with no description**
- Collector: `MAFSchemaIntrospectionCollector` mode `count`
- Params: `table=sys_script`, `filter=description=NULL^active=true^sys_packageNOT LIKEservicenow`
- Thresholds: red ≥ 100, amber ≥ 30, target ≤ 10
- Higher is better: **false**; weight 0.15
- Rationale: Undocumented custom business rules are the second-worst maintainability smell after duplicate order. Target is not zero because some trivial rules legitimately don't need documentation, but more than 30 is a sign nobody is reviewing.

**P-BR-05 — OOTB business rules marked customer-updated**
- Collector: `MAFDeclarativeCollector`
- Params: `source_table=sys_script`, `filter_condition=sys_package.sourceLIKEservicenow^sys_update_name!=NULL^sys_updated_byNOT=system`, `aggregation=count`
- Thresholds: red ≥ 30, amber ≥ 10, target ≤ 5
- Higher is better: **false**; weight 0.20
- Rationale: OOTB business rules modified by customers are technical debt. Every upgrade will either re-apply the modification or break it. This metric also exists in ITSM v3 for ITSM tables; this is the instance-wide version.

#### 6.3.5 Update set discipline — `platform_update_sets` (5 metrics, weight 0.10)

**P-US-01 — Update sets open in dev > 30 days**
- Collector: `MAFSchemaIntrospectionCollector` mode `count`
- Params: `table=sys_update_set`, `filter=state=in_progress^sys_updated_on<javascript:gs.daysAgoStart(30)^nameNOT LIKEDefault`
- Thresholds: red ≥ 20, amber ≥ 5, target ≤ 2
- Higher is better: **false**; weight 0.25
- Rationale: An update set open for more than 30 days is either forgotten or being used as a long-running feature branch. Either is a release discipline failure. Excludes the Default update set, which is always open by definition.

**P-US-02 — Update sets with no description**
- Collector: `MAFSchemaIntrospectionCollector` mode `count`
- Params: `table=sys_update_set`, `filter=description=NULL^nameNOT LIKEDefault`
- Thresholds: red ≥ 50, amber ≥ 15, target ≤ 5
- Higher is better: **false**; weight 0.20
- Rationale: An undescribed update set is a future "what is this for?" conversation. Discipline metric.

**P-US-03 — Update sets with zero customer updates**
- Collector: `MAFCrossTableRatioCollector`
- Params: `numerator_table=sys_update_set`, `numerator_filter=state=complete^nameNOT LIKEDefault`, `denominator_table=sys_update_xml`, `denominator_filter=` (joined conceptually; implementation iterates update sets and counts)

  *Note: this metric requires a small custom collector extension or a script-include wrapper because the logic is "count update sets whose related sys_update_xml count is zero." Final form TBD in implementation.*
- Thresholds: red ≥ 10, amber ≥ 3, target ≤ 1
- Higher is better: **false**; weight 0.15
- Rationale: A complete update set with zero customer updates is clutter — it was created, left empty, and closed. This indicates a team that clicks around without knowing what they're doing.

**P-US-04 — Update sets with conflicts unresolved**
- Collector: `MAFSchemaIntrospectionCollector` mode `count`
- Params: `table=sys_update_set`, `filter=conflicts!=NULL^state=in_progress`

  *Note: depending on the instance version, the conflict detection field may be elsewhere; this metric may become a batch/remote update set metric instead.*
- Thresholds: red ≥ 5, amber ≥ 1, target = 0
- Higher is better: **false**; weight 0.20
- Rationale: An in-progress update set with known conflicts is a deployment waiting to fail. These should be resolved before the sprint ends.

**P-US-05 — Update sets outside a batch**
- Collector: `MAFDeclarativeCollector`
- Params: `source_table=sys_update_set`, `filter_condition=parent=NULL^state=complete^nameNOT LIKEDefault`, `aggregation=percentage`, `denominator_filter=state=complete^nameNOT LIKEDefault`
- Thresholds: red ≥ 80%, amber ≥ 50%, target ≤ 20%
- Higher is better: **false**; weight 0.20
- Rationale: Update set batches are the modern way to deploy related changes atomically. A team that still deploys update sets individually is either on a pre-batch version or has not adopted modern release practice. Lower is better.

#### 6.3.6 Plugin & app footprint — `platform_footprint` (5 metrics, weight 0.06 — light touch)

**All metrics in this sub-category have a light touch on scoring. Their purpose is to surface context for the partner review, not to drive the final number.**

**P-FOOT-01 — Scoped apps count (customer-created)**
- Collector: `MAFDeclarativeCollector`
- Params: `source_table=sys_app`, `filter_condition=scope!=global^sourceNOT LIKEservicenow`, `aggregation=count`
- Thresholds: red ≥ 50, amber ≥ 20, target ≤ 10
- Higher is better: **false**; weight 0.20
- Rationale: Large numbers of customer-created scoped apps indicate a team building many small things rather than a few coherent platforms. Not inherently wrong; flagged for review.

**P-FOOT-02 — Global scope customizations (record count)**
- Collector: `MAFDeclarativeCollector`
- Params: `source_table=sys_metadata`, `filter_condition=sys_scope=global^sys_packageNOT LIKEservicenow`, `aggregation=count`
- Thresholds: red ≥ 5000, amber ≥ 2000, target ≤ 500
- Higher is better: **false**; weight 0.25
- Rationale: Customizations in global scope are technical debt — they bypass the scoped app isolation model and make upgrades harder. High counts indicate an older instance that never migrated to scoped apps.

**P-FOOT-03 — Plugins installed but inactive**
- Collector: `MAFDeclarativeCollector`
- Params: `source_table=v_plugin`, `filter_condition=active=false^status=installed`, `aggregation=count`
- Thresholds: red ≥ 30, amber ≥ 10, target ≤ 5
- Higher is better: **false**; weight 0.15
- Rationale: An installed-but-inactive plugin carries upgrade risk for zero benefit. Teams should either activate or uninstall.

**P-FOOT-04 — Store apps installed**
- Collector: `MAFDeclarativeCollector`
- Params: `source_table=sys_store_app`, `aggregation=count`
- Thresholds: red ≥ 40, amber ≥ 20, target ≤ 15
- Higher is better: **false**; weight 0.15
- Rationale: Store app count is pure context. Thresholds are set generously; the metric mostly exists so partners can see the shape of the app footprint. Intentionally low weight.

**P-FOOT-05 — Custom tables count**
- Collector: `MAFSchemaIntrospectionCollector` mode `count`
- Params: `table=sys_db_object`, `filter=name STARTSWITHu_^super_class=ISEMPTY`
- Thresholds: red ≥ 200, amber ≥ 100, target ≤ 50
- Higher is better: **false**; weight 0.25
- Rationale: Tables prefixed `u_` with no parent are fully custom. Large counts indicate a team that builds tables where extensions to existing tables would have served. Context metric.

#### 6.3.7 Email & integration health — `platform_email_integration` (5 metrics, weight 0.10)

**P-EI-01 — Outbound email failure rate (last 7 days)**
- Collector: `MAFWindowedRatioCollector`
- Params: `table=sys_email`, `numerator_filter=type=send-failed`, `denominator_filter=type=send-ready^ORtype=sent^ORtype=send-failed`, `window_field=sys_created_on`, `window_days=7`
- Thresholds: red ≥ 10%, amber ≥ 3%, target ≤ 1%
- Higher is better: **false**; weight 0.25
- Rationale: Outbound email is the single most visible integration path. A failure rate above 3% means users are not getting notifications and the team probably doesn't know.

**P-EI-02 — Inbound email processing errors (last 7 days)**
- Collector: `MAFSchemaIntrospectionCollector` mode `windowed_count`
- Params: `table=sys_email`, `filter=type=received^stateLIKEerror`, `window_field=sys_created_on`, `window_hours=168`
- Thresholds: red ≥ 100, amber ≥ 20, target ≤ 5
- Higher is better: **false**; weight 0.15
- Rationale: Failed inbound email processing silently drops customer requests. Most teams don't monitor this; this metric forces them to.

**P-EI-03 — REST messages using Basic Auth (% of active)**
- Collector: `MAFDeclarativeCollector`
- Params: `source_table=sys_rest_message`, `filter_condition=authentication_type=basic`, `aggregation=percentage`, `denominator_filter=`
- Thresholds: red ≥ 50%, amber ≥ 20%, target ≤ 10%
- Higher is better: **false**; weight 0.20
- Rationale: Basic Auth on outbound REST is a security smell — credentials in config, easy to leak, hard to rotate. OAuth or mutual TLS is the modern answer. Opinionated: this is one of the metrics partners may push back on, and that's fine.

**P-EI-04 — Failed REST outbound calls (last 24h)**
- Collector: `MAFSchemaIntrospectionCollector` mode `windowed_count`
- Params: `table=syslog`, `filter=source=RESTMessageV2^levelLIKEerror`, `window_hours=24`
- Thresholds: red ≥ 500, amber ≥ 100, target ≤ 20
- Higher is better: **false**; weight 0.20
- Rationale: A high rate of REST outbound errors indicates a broken integration that nobody is watching. Drill-down to message name shows which.

**P-EI-05 — Email notifications without a template**
- Collector: `MAFDeclarativeCollector`
- Params: `source_table=sysevent_email_action`, `filter_condition=active=true^message_template=NULL`, `aggregation=count`
- Thresholds: red ≥ 30, amber ≥ 10, target ≤ 3
- Higher is better: **false**; weight 0.20
- Rationale: A notification with inline HTML instead of a template is untranslatable, unmaintainable, and bypasses the notification theming system. Instance-wide version of the ITSM v3 "notifications using a template" metric; here measured as the inverse count.

#### 6.3.8 Security hygiene — `platform_security` (6 metrics, weight 0.20 — strictest)

**This is the sub-category where the pack is most opinionated. Thresholds are deliberately tight.**

**P-SEC-01 — Active admin users not logged in for 90+ days**
- Collector: `MAFCrossTableRatioCollector`
- Params: `numerator_table=sys_user_has_role`, `numerator_filter=role.name=admin^user.active=true^user.last_login<javascript:gs.daysAgoStart(90)`, `denominator_table=sys_user_has_role`, `denominator_filter=role.name=admin^user.active=true`
- Thresholds: red ≥ 20%, amber ≥ 5%, target = 0%
- Higher is better: **false**; weight 0.20
- Rationale: An active admin account with no recent login is a credential that could be compromised and nobody would notice. Target is zero; any above zero is a named conversation.

**P-SEC-02 — Admin role assignments without expiration**
- Collector: `MAFDeclarativeCollector`
- Params: `source_table=sys_user_has_role`, `filter_condition=role.name=admin^expires_at=NULL`, `aggregation=count`
- Thresholds: red ≥ 20, amber ≥ 5, target ≤ 2
- Higher is better: **false**; weight 0.20
- Rationale: Admin role should be time-bounded. Permanent admin assignments exist for a few well-known service accounts but should be rare. Opinionated: partners will push back on this, and that's the point.

**P-SEC-03 — ACLs in global scope touching scoped tables**
- Collector: `MAFSchemaIntrospectionCollector` mode `count`
- Params: `table=sys_security_acl`, `filter=sys_scope=global^nameLIKEx_` (scoped tables start with `x_`)
- Thresholds: red ≥ 10, amber ≥ 3, target = 0
- Higher is better: **false**; weight 0.15
- Rationale: A global-scope ACL modifying access to a scoped table defeats the scoped-app isolation model. Rare in healthy instances; non-zero is a conversation.

**P-SEC-04 — ACLs with no script and no roles (effectively open)**
- Collector: `MAFSchemaIntrospectionCollector` mode `count`
- Params: `table=sys_security_acl`, `filter=active=true^script=NULL^condition=NULL^sys_idNOT IN(SELECT acl FROM sys_security_acl_role)`

  *Note: the subquery-style filter may not work in encoded query; implementation may iterate ACLs and cross-check `sys_security_acl_role` for each. Final form TBD.*
- Thresholds: red ≥ 10, amber ≥ 2, target = 0
- Higher is better: **false**; weight 0.15
- Rationale: An ACL with no script, no condition, and no role attached grants access to everyone. This is the classic "I'll lock it down later" oversight. Should always be zero.

**P-SEC-05 — OOTB ACLs marked customer-updated**
- Collector: `MAFDeclarativeCollector`
- Params: `source_table=sys_security_acl`, `filter_condition=sys_packageLIKEservicenow^sys_update_name!=NULL^sys_updated_byNOT=system`, `aggregation=count`
- Thresholds: red ≥ 15, amber ≥ 5, target ≤ 2
- Higher is better: **false**; weight 0.15
- Rationale: Modifying OOTB ACLs is almost never the right answer; override via an additional ACL at higher order instead. This metric surfaces direct modifications that will break on upgrade.

**P-SEC-06 — Inactive users with active sessions or recent role grants**
- Collector: `MAFSchemaIntrospectionCollector` mode `count`
- Params: `table=sys_user_has_role`, `filter=user.active=false^sys_created_on>=javascript:gs.daysAgoStart(30)`
- Thresholds: red ≥ 5, amber ≥ 1, target = 0
- Higher is better: **false**; weight 0.15
- Rationale: Granting a role to an inactive user suggests a process that doesn't check user state before operating. Rare but high-signal when it occurs.

#### 6.3.9 Logging & error rates — `platform_logging_errors` (5 metrics, weight 0.10)

**P-LOG-01 — Distinct error messages in syslog (last 24h)**
- Collector: `MAFSchemaIntrospectionCollector` mode `windowed_count`

  *Note: this metric wants distinct count; may need a dedicated mode or a script-include wrapper.*
- Params: `table=syslog`, `filter=level=error`, `window_hours=24`, `distinct=message` (hypothetical)
- Thresholds: red ≥ 100, amber ≥ 30, target ≤ 10
- Higher is better: **false**; weight 0.25
- Rationale: Total error count is noisy (one bad integration in a loop can produce millions); distinct error *messages* is a much better signal of "how many different things are broken right now."

**P-LOG-02 — Unhandled exceptions (last 24h)**
- Collector: `MAFSchemaIntrospectionCollector` mode `windowed_count`
- Params: `table=syslog`, `filter=level=error^messageLIKEUncaught`, `window_hours=24`
- Thresholds: red ≥ 50, amber ≥ 10, target ≤ 2
- Higher is better: **false**; weight 0.25
- Rationale: Uncaught exceptions are unambiguous bugs. Any occurrence deserves a look; target is very low.

**P-LOG-03 — Script include execution errors (last 7 days)**
- Collector: `MAFSchemaIntrospectionCollector` mode `windowed_count`
- Params: `table=syslog`, `filter=source=script_include^level=error`, `window_hours=168`
- Thresholds: red ≥ 100, amber ≥ 20, target ≤ 5
- Higher is better: **false**; weight 0.20
- Rationale: Script include errors are the most actionable class of syslog error because the source is always identifiable. Drill-down to message shows the culprit.

**P-LOG-04 — Business rule execution errors (last 7 days)**
- Collector: `MAFSchemaIntrospectionCollector` mode `windowed_count`
- Params: `table=syslog`, `filter=sourceLIKEbusiness rule^level=error`, `window_hours=168`
- Thresholds: red ≥ 100, amber ≥ 20, target ≤ 5
- Higher is better: **false**; weight 0.15
- Rationale: Paired with P-BR-01/02/03 — business rule errors at runtime complement the static-sanity metrics.

**P-LOG-05 — Warning-to-error ratio (last 24h)**
- Collector: `MAFWindowedRatioCollector`
- Params: `table=syslog`, `numerator_filter=level=error`, `denominator_filter=level=warn^ORlevel=warning^ORlevel=error`, `window_field=sys_created_on`, `window_days=1`
- Thresholds: red ≥ 40%, amber ≥ 20%, target ≤ 10%
- Higher is better: **false**; weight 0.15
- Rationale: A healthy instance has many more warnings than errors; a ratio where errors approach warnings means either warnings are being suppressed or real problems are being logged as errors directly. Either is worth a conversation.

### 6.4 Collector usage summary for Platform Health metrics

| Collector | Metric count | Notes |
|---|---|---|
| `MAFDeclarativeCollector` | 14 | Simple count/percentage/sum/avg against one table |
| `MAFSchemaIntrospectionCollector` (`count`) | 16 | Allowlisted-table simple counts |
| `MAFSchemaIntrospectionCollector` (`windowed_count`) | 10 | Syslog/audit time-bounded counts |
| `MAFSchemaIntrospectionCollector` (`group_collision`) | 2 | Duplicate-order detection, grouped job runtime |
| `MAFSchemaIntrospectionCollector` (`row_count_over_threshold`) | 2 | Large-table detection |
| `MAFCrossTableRatioCollector` | 1 | Admin-user ratio |
| `MAFWindowedRatioCollector` | 3 | Error rates, email failure rate |
| Existing duration/grouped-average collectors | 0 | Not needed by Platform Health v1 |

46 metrics total. No metric requires a collector that doesn't already exist or isn't specified in Phase 1.

---

## 7. Out-of-the-box comparison

For each sub-category, what OOTB already provides and what gap Platform Health fills:

| Sub-category | OOTB equivalent | Gap filled |
|---|---|---|
| Instance performance | `stats.do`, `threads.do`, Performance Analytics (licensed) | Consolidated score with drill-down; unlicensed access |
| Data volume & retention | `sys_db_object` with manual sort | Automated flagging + threshold-based scoring |
| Scheduled job health | Scheduled Jobs list view | Aggregated errors, stuck jobs, discipline metrics |
| Business rule sanity | Business Rule list; no duplicate detection | Collision detection, anti-pattern scoring |
| Update set discipline | Update Set list; XPLR module | Opinionated scoring on age, batch adoption, description |
| Plugin & app footprint | Plugins module, System Applications | Consolidated count + opinionated thresholds |
| Email & integration health | Email log, REST message test UI | Aggregated failure rates, auth-type scoring |
| Security hygiene | Security Center (licensed), ACL lists | Unlicensed access; opinionated scoring on dormant admins, global-scope ACLs |
| Logging & error rates | `syslog` filter UI | Distinct-error count, uncaught exception isolation |

Platform Health does not *replace* any of these OOTB tools. It produces a score and drill-down list that a partner can walk a customer through in a 30-minute review meeting, which none of the OOTB tools do.

---

## 8. Risks and mitigations

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Phase 0 migration shifts ITSM scores mid-engagement | High | Medium | Archive pre-migration runs; communicate shift; tune sub-category weights for continuity |
| R2 | `MAFSchemaIntrospectionCollector` allowlist becomes a "just add your table here" dumping ground | Medium | High | Require update set to modify allowlist; code-review gate on allowlist changes |
| R3 | `row_count_over_threshold` mode blows up on instances with thousands of tables | Low | High | Hard cap via `max_tables_scanned`; error-not-truncate on cap exceeded |
| R4 | Opinionated thresholds cause partner pushback that slows adoption | Medium | Medium | Ship rationales in `description`; document override mechanism; accept that some pushback is the feature working |
| R5 | Syslog metrics produce different numbers on instances with different log retention | High | Low | All syslog metrics are time-windowed, not lifetime; windows are tuned so that a minimum-retention instance still has enough data |
| R6 | Security sub-category is too strict for customers in well-justified exception states | Medium | Medium | Per-customer threshold overrides; document at-a-glance which metrics are "usually override" vs "almost never override" |
| R7 | Platform Health category dwarfs ITSM category in customer mental model because it has more metrics | Medium | Low | Dashboard presentation orders categories by weight, not metric count; accept that platform is more important than any process pack anyway |
| R8 | Two-level rollup makes category scores less comparable to historical one-level rollups | High | Low | Accept the continuity hit; archive pre-migration runs; emphasize sub-category scores in post-migration reporting |

---

## 9. Follow-ups and explicit non-goals deferred

These are out of scope for this PRD but are noted so they don't get lost:

1. **Backfill `description` on the existing 70 ITSM metrics.** None of them have descriptions today. Not blocking Platform Health, but should happen before a v4 of ITSM.
2. **Trend reporting layer.** Read N recent `assessment_run` rows per customer and produce a "your score over time" widget. Deferred intentionally; the data model already supports it.
3. **CMDB/CSDM Governance pack.** As discussed, not competing with OOTB; would cover gaps like service mapping coverage, CI ownership, CSDM structural alignment. Wait until a customer asks for it.
4. **Automation & Integration Maturity pack.** The pack we discussed as option 2 behind Platform Health. Should come next; will reuse most of what Phase 1 delivers.
5. **Weight management UI.** Once sub-categories are in, a list-view-friendly editor for sub-category weights would cut rebalancing time significantly. Not in scope here.
6. **Per-customer threshold overrides stored as data, not update sets.** Currently, overriding a threshold for one customer means a cloned metric definition. A proper override table (`x_maf_core_customer_metric_override`) would be cleaner. Noted for a future infrastructure PRD.
7. **`MAFScoringEngine` category rollup for packs with mixed sub-categorized and flat metrics.** During the transition window after Phase 0 ships but before all ITSM metrics are migrated, mixed categories are possible. The current pseudocode excludes null-`sub_category` metrics from rollup, which is the safe choice but temporarily lowers scores. Decide at implementation time whether a "fallback flat rollup" is worth adding for the transition window.

---

## 10. Phase sequencing and shipping order

| Phase | Artifact | Shippable independently? | Notes |
|---|---|---|---|
| 0a | Schema update set (`x_maf_core_sub_category`, `x_maf_core_sub_category_score`, `sub_category` field) | Yes | No behavior change |
| 0b | Data update set (sub-categories created, existing 70 metrics migrated) | Yes after 0a | No behavior change until 0c |
| 0c | Code update set (`MAFScoringEngine.scoreRun` rewrite) | Yes after 0b | Behavior change; scores shift |
| 1 | `MAFSchemaIntrospectionCollector` | Yes | Unused until Phase 2 metrics reference it |
| 2a | Platform Health category + sub-categories (schema data) | Yes after 1 | Empty pack; produces no metrics |
| 2b | Platform Health metric definitions (all 46) | Yes after 2a | First runs produce Platform Health scores |

Phases can be combined into fewer update sets at implementation time, but the *ordering* above must be preserved.

---

## 11. Acceptance criteria (pack-level)

- [ ] Phase 0 acceptance criteria from §4.7 met.
- [ ] Phase 1 acceptance criteria from §5.7 met.
- [ ] New category `platform_health` created with all nine sub-categories; sub-category weights sum to approximately 1.00.
- [ ] 46 metric definitions deployed; every metric has `description` populated with rationale; every metric references a valid collector and valid `script_params` or filter.
- [ ] First end-to-end assessment run against a reference instance produces a `platform_health` category score and all nine sub-category scores.
- [ ] Every sub-category has at least three metrics in green state and at least one in non-green state in a deliberately degraded test fixture, proving the RAG propagation works.
- [ ] Drill-down from every red metric produces a usable list view in the target table.
- [ ] No metric in Platform Health overlaps with an ITSM v3 Platform Hygiene metric per the boundary in §6.2.
- [ ] Documentation artifact produced: a one-page "what this pack measures and why" explainer suitable for partner delivery leads.
