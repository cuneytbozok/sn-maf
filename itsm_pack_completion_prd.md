# PRD — ITSM Pack Completion & Collector Refactor (`x_maf_core`)

**Owner:** Maturity Assessment Framework
**Scope:** `x_maf_core` scoped app
**Status:** Draft for implementation
**Target branch:** `feat/itsm-pack-v2`

---

## 1. Background

The current ITSM metric pack has **10 metrics**, all of them Incident-centric. Three problems:

1. **Coverage gap.** ITSM in ITIL v4 spans Incident, Problem, Change, Request Fulfillment, and Knowledge Management. Today only Incident is represented, with a single weak proxy for Problem (`recurring_incidents_problem_link`) and a single weak proxy for Knowledge (`resolved_kb_style_close_codes`).
2. **Script-include sprawl.** Anything the existing `MAFDeclarativeCollector` can't express (durations, windowed aggregates, dedup, cross-table joins) currently requires a bespoke Script Include per metric. We already have three: `ITSMMTTRCollector`, `ITSMReopenRateCollector`, `ITSMRecurringProblemLinkCollector`. Scaling this pattern to a complete pack would mean ~15 more Script Includes — unmaintainable, untestable, and duplicative (each one reimplements the same `initialize`/`collect`/try-catch/params-parse boilerplate).
3. **No table agility.** The existing collectors are hardcoded to `incident`. We cannot reuse MTTR logic for `sc_req_item` fulfillment time or `change_request` lead time without copy-pasting classes.

This PRD delivers (a) a reusable collector layer that covers the next tier of metric patterns declaratively, and (b) the missing ITSM metrics configured as rows on top of that layer.

---

## 2. Goals

1. **No new per-metric Script Includes** for any metric added in this PRD. Every new metric must be expressible as a row in `x_maf_core_metric_definition` referencing one of the existing or new reusable collectors.
2. **Complete ITSM pack coverage** across all five ITIL practices: Incident, Problem, Change, Request Fulfillment, Knowledge Management.
3. **Retire** the three bespoke ITSM collectors (`ITSMMTTRCollector`, `ITSMReopenRateCollector`, `ITSMRecurringProblemLinkCollector`) by migrating their metrics onto the new reusable collectors. Leave the class files in place but mark them `@deprecated` and unreferenced.
4. **Backward compatibility.** Existing metric rows must continue to produce the same numeric values after migration (±rounding).

## 3. Non-goals

- UI/dashboard changes. This PRD is collectors + metric definitions only.
- Changes to `MAFAssessmentRunner`, `MAFScoringEngine`, `MAFAISummaryProvider`, `MAFDrillDownBuilder`.
- Changes to category tables or category sys_ids.
- New collector types beyond the two introduced here (`MAFDurationCollector`, `MAFWindowedRatioCollector`). If a future metric needs something neither the existing `MAFDeclarativeCollector` nor these two can express, that's a separate PRD.

---

## 4. Architecture change — reusable collector layer

### 4.1 Problem pattern analysis

Looking at the three existing bespoke collectors, they are three instances of two patterns:

| Collector | Pattern | What makes it "not declarative" |
|---|---|---|
| `ITSMMTTRCollector` | Average of `(end_field − start_field)` over records matching a windowed filter | Duration arithmetic on GlideDateTime |
| `ITSMReopenRateCollector` | `count(numerator) / count(denominator)` where both filters are windowed | Windowed cutoff computed at run time |
| `ITSMRecurringProblemLinkCollector` | Among records where a group-by key appears ≥ N times in a window, percentage with a field set | Dedup/frequency pre-pass |

Patterns #1 and #2 cover ~90% of realistic ITSM KPIs. Pattern #3 is genuinely exotic and should stay as a single bespoke collector (or be retired in favor of a simpler proxy — see §6).

### 4.2 New Script Include: `MAFDurationCollector`

**Purpose:** compute average, median, p90, p95, max, or count of a duration `(end_field − start_field)` in a chosen unit, over any table, filtered by any encoded query, optionally with a rolling window.

**Location:** `x_maf_core.MAFDurationCollector`, extends `MAFMetricCollectorBase`.

**`script_params` JSON schema:**

```json
{
  "table": "incident",
  "start_field": "opened_at",
  "end_field": "resolved_at",
  "filter": "state=6",
  "window_field": "resolved_at",
  "window_days": 30,
  "unit": "hours",
  "aggregation": "avg"
}
```

| Param | Required | Default | Notes |
|---|---|---|---|
| `table` | yes | — | Any table with the start/end datetime fields |
| `start_field` | yes | — | Must be a datetime field |
| `end_field` | yes | — | Must be a datetime field |
| `filter` | no | `''` | Encoded query appended to window filter with `^` |
| `window_field` | no | `end_field` | Which field the rolling window is applied to |
| `window_days` | no | none | If omitted, no window is applied |
| `unit` | no | `hours` | One of `minutes`, `hours`, `days`, `business_hours` (business_hours requires `schedule_sys_id` param and uses `DurationCalculator`) |
| `aggregation` | no | `avg` | One of `avg`, `median`, `p90`, `p95`, `max`, `min`, `count` |
| `schedule_sys_id` | conditional | — | Required only when `unit=business_hours` |

**Behavior:**

- Validates `table`, `start_field`, `end_field` exist on the instance via `GlideRecord.isValidField`. If not, return `{value: null, error: 'field X not available on this instance'}`.
- Computes `cutoff = now − window_days` when `window_days` is set, appends `^${window_field}>=${cutoff}^${start_field}ISNOTEMPTY^${end_field}ISNOTEMPTY` to the filter.
- Iterates records, computes `(end − start)` in milliseconds, skips negatives and zeros.
- For `avg`/`max`/`min`/`count`: single pass.
- For `median`/`p90`/`p95`: collect all values into an array and sort. Cap the array at 50,000 records; if exceeded, return `{value: null, error: 'duration aggregation exceeded 50000 records; narrow the filter or window'}`.
- Converts to requested unit before returning.
- Returns `{value, drillDownTable: table, drillDownQuery: finalFilter, error: null}`.

**Test replacement for `ITSMMTTRCollector`:** a metric definition with `collector_type=script_include`, `script_include=MAFDurationCollector`, and `script_params={"table":"incident","start_field":"opened_at","end_field":"resolved_at","filter":"state=6","window_field":"resolved_at","window_days":30,"unit":"hours","aggregation":"avg"}` must produce the same numeric value as the existing `mttr_hours_30d` metric (±0.01 hours).

### 4.3 New Script Include: `MAFWindowedRatioCollector`

**Purpose:** compute `count(numerator_filter) / count(denominator_filter) * 100`, where both filters may include a rolling window computed at run time. This generalizes `MAFDeclarativeCollector._percentage` to support windows without requiring callers to hand-compute cutoff dates (which is impossible to do declaratively because the cutoff changes every run).

**Location:** `x_maf_core.MAFWindowedRatioCollector`, extends `MAFMetricCollectorBase`.

**`script_params` JSON schema:**

```json
{
  "table": "incident",
  "numerator_filter": "state=6^reopen_count>0",
  "denominator_filter": "state=6",
  "window_field": "resolved_at",
  "window_days": 30,
  "empty_denominator_value": 0,
  "higher_is_better": false
}
```

| Param | Required | Default | Notes |
|---|---|---|---|
| `table` | yes | — | |
| `numerator_filter` | yes | — | Encoded query |
| `denominator_filter` | yes | — | Encoded query |
| `window_field` | no | none | Datetime field the window applies to |
| `window_days` | no | none | If set, appends `^${window_field}>=${cutoff}` to both filters |
| `empty_denominator_value` | no | `0` | What to return when denominator count is 0 |
| `higher_is_better` | no | inherited from metric def | Used only for drilldown hinting |

**Behavior:**

- Uses `GlideAggregate` with `COUNT` for both queries.
- Validates `window_field` exists on table if `window_days` is set.
- Returns `{value: (num/den)*100, drillDownTable: table, drillDownQuery: numerator_filter_with_window, error: null}`.

**Test replacement for `ITSMReopenRateCollector`:** migrate `reopen_rate_30d` to `script_include=MAFWindowedRatioCollector` with `script_params={"table":"incident","numerator_filter":"state=6^reopen_count>0","denominator_filter":"state=6","window_field":"resolved_at","window_days":30}`. Result must match the existing value.

### 4.4 What stays as bespoke

`ITSMRecurringProblemLinkCollector` stays. Its dedup-by-short-description pre-pass is genuinely unique and not worth generalizing for one metric. However, also see §6 — we may retire this metric in favor of a simpler proxy and delete the collector entirely. Default: keep it, mark as "legacy" in description.

### 4.5 Rename existing collectors for clarity

Nothing in this PRD renames existing classes (which would break references). The three legacy ITSM collectors keep their names, and their class files get a `@deprecated use MAFDurationCollector` JSDoc comment at the top after migration completes.

---

## 5. Metric definitions — full ITSM pack

All metrics below are new rows in `x_maf_core_metric_definition` unless marked **[MIGRATED]**. Migrated rows keep their `sys_id` but have their `collector_type`, `script_include`, and `script_params` updated.

Categories use existing sys_ids:
- Data Quality: `7cbd0c980b0b4d1a9ad8694cde0e4c10`
- Operational Performance: `c0f44935da5a479b8104c3766cb07cc0`
- Process Adherence: `30222661803443c18ebac363b3e02b8c`

Category weights must sum to 1.0 per category after additions. New weight distributions are specified per metric; totals are verified in §5.6.

### 5.1 Incident Management — additions

| # | name | label | collector | source | key params / filter | thresholds (target / amber / red) | weight | higher_is_better |
|---|---|---|---|---|---|---|---|---|
| I1 | `major_incident_mttr_hours_30d` | Major incident MTTR (hours) | `MAFDurationCollector` | — | `table=incident`, `start_field=opened_at`, `end_field=resolved_at`, `filter=state=6^priority=1`, `window_field=resolved_at`, `window_days=30`, `unit=hours`, `aggregation=avg` | 4 / 12 / 24 | 0.15 (OpPerf) | false |
| I2 | `incident_backlog_aged_30d` | Open incidents older than 30 days (%) | `MAFDeclarativeCollector` | `incident` | `filter=active=true^opened_at<javascript:gs.daysAgoStart(30)`, `denominator=active=true`, `aggregation=percentage` | 2 / 10 / 25 | 0.15 (OpPerf) | false |
| I3 | `incident_reassignment_low` | Incidents resolved with ≤1 reassignment (%) | `MAFDeclarativeCollector` | `incident` | `filter=state=6^reassignment_count<=1`, `denominator=state=6`, `aggregation=percentage` | 85 / 70 / 50 | 0.15 (ProcAdh) | true |
| I4 | **[MIGRATED]** `mttr_hours_30d` | Mean time to resolve (hours) | `MAFDurationCollector` | — | See §4.2 | keep existing (8/24/48) | 0.20 (was 0.35) | false |
| I5 | **[MIGRATED]** `reopen_rate_30d` | Reopen rate (last 30 days) | `MAFWindowedRatioCollector` | — | See §4.3 | keep existing (2/7/15) | 0.20 (was 0.35) | false |

> **Note on I3:** `reassignment_count` is OOTB on `incident`. If absent on an instance, the metric returns null with error — acceptable.
> **Note on I2:** `javascript:gs.daysAgoStart(30)` is evaluated by the platform at query time.

### 5.2 Problem Management — new practice

| # | name | label | collector | source | key params / filter | thresholds | weight | higher_is_better |
|---|---|---|---|---|---|---|---|---|
| P1 | `problem_root_cause_identified` | Problems with root cause documented (%) | `MAFDeclarativeCollector` | `problem` | `filter=state=4^rcaISNOTEMPTY`, `denominator=state=4`, `aggregation=percentage` | 85 / 65 / 40 | 0.10 (ProcAdh) | true |
| P2 | `problem_known_error_rate` | Problems flagged as known errors (%) | `MAFDeclarativeCollector` | `problem` | `filter=known_error=true`, `denominator=stateNOT IN1,2`, `aggregation=percentage` | 60 / 40 / 20 | 0.05 (ProcAdh) | true |
| P3 | `problem_backlog_aged_90d` | Open problems older than 90 days (%) | `MAFDeclarativeCollector` | `problem` | `filter=active=true^opened_at<javascript:gs.daysAgoStart(90)`, `denominator=active=true`, `aggregation=percentage` | 5 / 20 / 40 | 0.10 (OpPerf) | false |
| P4 | `problem_mean_age_to_known_error_days` | Mean time to known error (days) | `MAFDurationCollector` | — | `table=problem`, `start_field=opened_at`, `end_field=first_known_error_at`, `unit=days`, `aggregation=avg` | 7 / 21 / 45 | 0.10 (OpPerf) | false |

> **P4 caveat:** `first_known_error_at` is not OOTB. Either add a business rule that stamps it (preferred, out of scope for this PRD) **or** replace P4 with a simpler "age of open problems currently flagged known_error" metric using `MAFDeclarativeCollector`. **Decision for v1:** skip P4 entirely; we will do it in a follow-up once the field exists. Do not implement it in this PRD.

### 5.3 Change Management — new practice

| # | name | label | collector | source | key params / filter | thresholds | weight | higher_is_better |
|---|---|---|---|---|---|---|---|---|
| C1 | `change_success_rate` | Change success rate (%) | `MAFDeclarativeCollector` | `change_request` | `filter=state=3^close_code=successful`, `denominator=state=3`, `aggregation=percentage` | 95 / 85 / 70 | 0.30 (OpPerf) | true |
| C2 | `change_emergency_ratio` | Emergency change ratio (%) | `MAFDeclarativeCollector` | `change_request` | `filter=type=emergency`, `denominator=active=false`, `aggregation=percentage` | 5 / 12 / 25 | 0.10 (ProcAdh) | false |
| C3 | `change_unauthorized_rate` | Unauthorized / unsuccessful change rate (%) | `MAFDeclarativeCollector` | `change_request` | `filter=state=3^close_codeIN unsuccessful,unauthorized`, `denominator=state=3`, `aggregation=percentage` | 2 / 8 / 20 | 0.10 (OpPerf) | false |
| C4 | `change_lead_time_hours_normal` | Normal change lead time — requested to scheduled (hours) | `MAFDurationCollector` | — | `table=change_request`, `start_field=requested_by_date`, `end_field=start_date`, `filter=type=normal`, `window_field=start_date`, `window_days=90`, `unit=hours`, `aggregation=avg` | 48 / 120 / 240 | 0.10 (OpPerf) | false |
| C5 | `change_backout_completed` | Changes with backout plan documented (%) | `MAFDeclarativeCollector` | `change_request` | `filter=active=true^backout_planISNOTEMPTY`, `denominator=active=true`, `aggregation=percentage` | 95 / 80 / 60 | 0.10 (DataQty) | true |
| C6 | `change_cab_required_approved` | Normal changes with CAB approval recorded (%) | `MAFDeclarativeCollector` | `change_request` | `filter=type=normal^state=3^approval=approved`, `denominator=type=normal^state=3`, `aggregation=percentage` | 98 / 90 / 75 | 0.10 (ProcAdh) | true |

### 5.4 Request Fulfillment — new practice

| # | name | label | collector | source | key params / filter | thresholds | weight | higher_is_better |
|---|---|---|---|---|---|---|---|---|
| R1 | `sla_attainment_ritm` | SLA attainment (RITM task SLAs) | `MAFDeclarativeCollector` | `task_sla` | `filter=has_breached=false^task.sys_class_name=sc_req_item`, `denominator=task.sys_class_name=sc_req_item`, `aggregation=percentage` | 97 / 88 / 75 | 0.20 (ProcAdh) | true |
| R2 | `ritm_fulfillment_time_hours_30d` | RITM fulfillment time (hours) | `MAFDurationCollector` | — | `table=sc_req_item`, `start_field=opened_at`, `end_field=closed_at`, `filter=state=3`, `window_field=closed_at`, `window_days=30`, `unit=hours`, `aggregation=avg` | 24 / 72 / 168 | 0.10 (OpPerf) | false |
| R3 | `ritm_approval_cycle_time_hours` | RITM approval cycle time (hours) | `MAFDurationCollector` | — | `table=sysapproval_approver`, `start_field=sys_created_on`, `end_field=sys_updated_on`, `filter=stateIN approved,rejected^source_table=sc_req_item`, `window_field=sys_updated_on`, `window_days=30`, `unit=hours`, `aggregation=avg` | 8 / 24 / 72 | 0.05 (OpPerf) | false |

> **R1 weight reshuffle:** existing `sla_attainment_incident` is 0.40 of ProcAdh. Reduce it to 0.25 and give R1 0.20. See §5.6.

### 5.5 Knowledge Management — new practice

| # | name | label | collector | source | key params / filter | thresholds | weight | higher_is_better |
|---|---|---|---|---|---|---|---|---|
| K1 | `kb_article_freshness` | KB articles reviewed in last 12 months (%) | `MAFDeclarativeCollector` | `kb_knowledge` | `filter=workflow_state=published^sys_updated_on>=javascript:gs.monthsAgoStart(12)`, `denominator=workflow_state=published`, `aggregation=percentage` | 80 / 60 / 35 | 0.10 (DataQty) | true |
| K2 | `kb_orphaned_articles` | Published KB articles with zero views in 90 days (%) | `MAFDeclarativeCollector` | `kb_knowledge` | `filter=workflow_state=published^use_count=0^sys_created_on<javascript:gs.daysAgoStart(90)`, `denominator=workflow_state=published`, `aggregation=percentage` | 5 / 15 / 30 | 0.05 (DataQty) | false |
| K3 | `incident_kb_attached_at_resolve` | Resolved incidents with KB article linked (%) | `MAFDeclarativeCollector` | `incident` | `filter=state=6^kb_knowledgeISNOTEMPTY`, `denominator=state=6`, `aggregation=percentage` | 50 / 30 / 15 | 0.05 (ProcAdh) | true |

> **K3 caveat:** `incident.kb_knowledge` isn't OOTB on every instance. If the instance uses a different join table for KB-to-incident, the filter needs adjustment per-instance. Document this in the metric description field. K3 replaces the existing `resolved_kb_style_close_codes` metric (see §5.6) — retire the old one.

### 5.6 Final category weight distribution

After adding new metrics and migrating/retiring, all categories must sum to 1.0.

**Data Quality** (target sum = 1.00)
| Metric | Old weight | New weight |
|---|---|---|
| `assignment_group_at_resolve` | 0.30 | 0.20 |
| `incident_category_populated` | 0.25 | 0.20 |
| `incident_ci_linked` | 0.25 | 0.20 |
| `incident_short_description_length` | 0.20 | 0.10 |
| C5 `change_backout_completed` | — | 0.10 |
| K1 `kb_article_freshness` | — | 0.10 |
| K2 `kb_orphaned_articles` | — | 0.05 |
| Total | 1.00 | 0.95 |

⚠️ **Data Quality sums to 0.95, not 1.00.** Adjust `assignment_group_at_resolve` to 0.25 to close the gap. **Final DQ totals: 0.25 + 0.20 + 0.20 + 0.10 + 0.10 + 0.10 + 0.05 = 1.00.** ✓

**Operational Performance** (target sum = 1.00)
| Metric | Old weight | New weight |
|---|---|---|
| `mttr_hours_30d` (I4) | 0.35 | 0.15 |
| `reopen_rate_30d` (I5) | 0.35 | 0.10 |
| `first_call_resolution_rate` | 0.30 | 0.10 |
| I1 `major_incident_mttr_hours_30d` | — | 0.10 |
| I2 `incident_backlog_aged_30d` | — | 0.05 |
| P3 `problem_backlog_aged_90d` | — | 0.05 |
| C1 `change_success_rate` | — | 0.20 |
| C3 `change_unauthorized_rate` | — | 0.05 |
| C4 `change_lead_time_hours_normal` | — | 0.05 |
| R2 `ritm_fulfillment_time_hours_30d` | — | 0.10 |
| R3 `ritm_approval_cycle_time_hours` | — | 0.05 |
| Total | 1.00 | 1.00 ✓ |

**Process Adherence** (target sum = 1.00)
| Metric | Old weight | New weight |
|---|---|---|
| `sla_attainment_incident` | 0.40 | 0.20 |
| `recurring_incidents_problem_link` | 0.30 | 0.05 |
| `resolved_kb_style_close_codes` | 0.30 | **RETIRED** — replaced by K3 |
| I3 `incident_reassignment_low` | — | 0.10 |
| P1 `problem_root_cause_identified` | — | 0.15 |
| P2 `problem_known_error_rate` | — | 0.05 |
| C2 `change_emergency_ratio` | — | 0.10 |
| C6 `change_cab_required_approved` | — | 0.10 |
| R1 `sla_attainment_ritm` | — | 0.20 |
| K3 `incident_kb_attached_at_resolve` | — | 0.05 |
| Total | 1.00 | 1.00 ✓ |

**Retirement actions:**
- `resolved_kb_style_close_codes` → set `active=false`. Do not delete the row (audit trail).
- `recurring_incidents_problem_link` → keep active at weight 0.05 (legacy signal, low weight).

**Metric count after changes:** 10 existing + 3 Incident (I1–I3) + 3 Problem (P1–P3) + 6 Change (C1–C6) + 3 Request (R1–R3) + 3 Knowledge (K1–K3) − 1 retired = **27 metrics**.

---

## 6. Implementation plan

### Phase 1 — Collector layer
1. Create `x_maf_core.MAFDurationCollector` per §4.2.
2. Create `x_maf_core.MAFWindowedRatioCollector` per §4.3.
3. Add unit-test-style fixtures in a separate Script Include `MAFCollectorTestFixtures` that can be run from Background Scripts to validate both new collectors against synthetic data.

### Phase 2 — Migrate existing bespoke collectors
4. Update `mttr_hours_30d` metric row to use `MAFDurationCollector`. Run both old and new in parallel on a test instance and verify values match.
5. Update `reopen_rate_30d` metric row to use `MAFWindowedRatioCollector`. Same parallel verification.
6. Mark `ITSMMTTRCollector`, `ITSMReopenRateCollector` as `@deprecated` in JSDoc. Do not delete.
7. Leave `recurring_incidents_problem_link` and `ITSMRecurringProblemLinkCollector` alone.

### Phase 3 — Add new metrics
8. Insert all new metric definitions from §5.1–§5.5 (except P4, skipped).
9. Update weights per §5.6 for all existing metrics.
10. Retire `resolved_kb_style_close_codes` (`active=false`).

### Phase 4 — Verification
11. Run a full assessment on a dev instance with the updated pack. Confirm no metric returns an error for field-availability reasons on a vanilla instance. Any that do must be documented in the metric `description` field with the condition that needs to hold.
12. Confirm each category's weighted score still falls in a plausible range (0–100) by comparing to the pre-change score.

### Phase 5 — Update pack
13. Regenerate the XML export (`x_maf_core_metric_definition.xml`) and commit.

---

## 7. Acceptance criteria

- [ ] `MAFDurationCollector` and `MAFWindowedRatioCollector` exist in `x_maf_core` scope and pass the fixture tests.
- [ ] No new Script Include is created for any metric in §5.
- [ ] All 16 new metric rows from §5 exist and are active (P4 excluded).
- [ ] `mttr_hours_30d` and `reopen_rate_30d` are migrated and produce values within ±0.01 of their pre-migration values on the same dataset.
- [ ] `resolved_kb_style_close_codes` is `active=false`.
- [ ] Data Quality, Operational Performance, and Process Adherence weights each sum to exactly 1.00. A pre-commit sanity check script verifies this.
- [ ] A full assessment run completes without collector errors on a vanilla `sn_ci_now/San Diego+` (or equivalent) instance.
- [ ] `ITSMMTTRCollector` and `ITSMReopenRateCollector` carry `@deprecated` JSDoc but are not deleted.
- [ ] The exported `x_maf_core_metric_definition.xml` contains 27 active records + 1 inactive (retired).

---

## 8. Open questions / instance-dependent decisions

1. **Category weights** are a judgment call. The distributions in §5.6 are deliberately conservative (Incident stays dominant because it has the most data). If stakeholders want Change to carry more weight, the OpPerf redistribution is the lever.
2. **P4 (time-to-known-error)** depends on a custom field. Confirmed deferred to a follow-up PRD.
3. **K3 (`incident.kb_knowledge`)** — verify field exists on target instances before activating. If not, swap for a proxy using `close_notes` containing a KB reference pattern.
4. **R3 (approval cycle time via `sysapproval_approver`)** — the `sys_created_on`/`sys_updated_on` pair is a rough proxy for "time in waiting state." A more accurate metric would need audit history. Acceptable for v1; flag in description.
5. **Business-hours unit support in `MAFDurationCollector`** — nice to have, but not required for any metric in §5. Implement the param surface but mark `unit=business_hours` as throwing `'not yet implemented'` until a follow-up. Alternatively: skip it from the schema entirely for v1. **Recommendation: skip for v1**, keep schema minimal.

---

## 9. Out of scope (future PRDs)

- Trend metrics (delta vs previous period)
- Per-assignment-group drilldown metrics
- SLA metric decomposition by priority
- Cross-process metrics (e.g., % of P1 incidents that spawned a problem record within N days)
- UI for metric authoring
