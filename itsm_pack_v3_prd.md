# PRD — ITSM Pack v3: Platform Hygiene & Implementation Quality (`x_maf_core`)

**Owner:** Maturity Assessment Framework
**Scope:** `x_maf_core` scoped app
**Status:** Draft for implementation
**Predecessor:** ITSM Pack v2 (27 metrics, `MAFDurationCollector` + `MAFWindowedRatioCollector` landed)
**Target branch:** `feat/itsm-pack-v3`

---

## 1. Framing — the gap v2 left

v2 (the 27-metric pack currently live) measures **process outcomes**: MTTR, change success rate, SLA attainment, reopen rate, etc. These answer the question *"is the ITIL practice working?"*

What v2 does **not** measure is whether the underlying ServiceNow **implementation** is sustainable. Two customers can have identical MTTR numbers on top of wildly different builds:

- **Customer A:** 300 catalog items, each pointing to its own bespoke legacy `wf_workflow`, with 40 client scripts per item doing show/hide logic, no taxonomy, assignment groups hardcoded in business rules via sys_id.
- **Customer B:** 300 catalog items, 12 reusable Flow Designer flows, UI Policies for presentation, tiered taxonomy, assignment via Data Lookups.

Customer A's MTTR might even look better this quarter. But A will collapse the moment someone touches it, while B is cheap to evolve. A complete ITSM assessment has to see both.

This PRD adds **platform hygiene** as a first-class dimension of the assessment, alongside process outcomes. It also adds the major incident, catalog, and assignment metrics that v2 skipped.

## 2. What's still missing after v2

Grouped by theme:

1. **Major Incident process** — nothing. `incident.major_incident_state` exists OOTB and tracks promotion, but v2 has zero metrics on MI volume, MI MTTR specifically, MI communication, or PIR completion.
2. **Catalog surface health** — v2 has one metric on `sc_req_item` (fulfillment time). Nothing on the catalog itself: item count, item health, abandoned items, variable sprawl, description/picture completeness, taxonomy usage.
3. **Fulfillment mechanism** — v2 says nothing about whether catalog items use legacy Workflow or Flow Designer, whether flows are generalized or bespoke per item, whether subflows are used for reuse.
4. **Client-side implementation quality** — average client scripts per item, UI Policies vs Client Scripts ratio, client-side complexity.
5. **Variable hygiene** — avg variables per item, reference variables without qualifiers, variable sets reuse.
6. **Assignment strategy** — AWA adoption, assignment rules count, Data Lookup usage, manual vs automated assignment.
7. **Taxonomy** — existence, depth, item coverage, orphaned categories.
8. **Customization debt** — customized OOTB business rules, UI policies, client scripts on core ITSM tables.
9. **Notification hygiene** — template use, active notification count sanity.
10. **SLA definition health** — schedules set, pause conditions, breach coverage.
11. **Cross-process CMDB linkage** — incident CI is covered; problem CI and change CI are not.

This PRD addresses 1–11.

## 3. Goals

1. **Add two new categories** to the scoring model: `Platform Hygiene` and `Automation & Reuse`. The existing three (Data Quality, Operational Performance, Process Adherence) remain unchanged in structure.
2. **Add ~35 new metrics** across the themes above.
3. **No new per-metric script includes.** Every new metric must be a row, configured against the existing collectors *or* against at most **two new reusable collectors** introduced here.
4. **Enforce the 0.11 SI-per-metric ceiling.** After this PRD, the pack has ~62 metrics and 7 collector script includes. Any future PRD that degrades this ratio gets rejected.
5. **Backward compatibility.** All v2 metrics continue to work unchanged. No v2 metric is retired in this PRD.

## 4. Non-goals

- Script-content scanning (regex over the `script` field of business rules/client scripts to detect hardcoded sys_ids, deprecated API calls, etc.). This is powerful but fragile as a KPI — it belongs in a separate "code quality" pack, not the ITSM pack.
- Scoring model changes (weight hierarchies, sub-categories, metric groups). Flagged as follow-up in §10.
- Dashboard / UI changes.
- Customer-specific allowlists or exceptions.
- Predictive Intelligence / ML adoption metrics — deferred to an "AI Ops" pack.

---

## 5. Architecture — two new reusable collectors

### 5.1 Pattern gap analysis

The v2 collectors (`MAFDeclarativeCollector`, `MAFDurationCollector`, `MAFWindowedRatioCollector`) cover:

- Count / sum / avg / percentage on a single table with an encoded filter.
- Duration arithmetic on a single table.
- Windowed count ratios on a single table.

The v3 metrics below require two capabilities none of these support:

**Capability A — ratio across two different tables.**
Example: "percentage of active catalog items whose fulfillment mechanism is a Flow Designer flow (not a legacy workflow)." Numerator: `sc_cat_item` where `flow_designer_flow ISNOTEMPTY`. Denominator: `sc_cat_item` where `active=true`. Both on `sc_cat_item`, so this one is expressible today. But: "ratio of distinct flows to active catalog items" needs `count_distinct(sc_cat_item.flow_designer_flow) / count(sc_cat_item where active=true)` — two different aggregations, effectively two tables worth of logic.

More importantly: "catalog items with any UI policy attached" needs `count(catalog_ui_policy where active=true AND cat_item IN active items) / count(sc_cat_item where active=true)` — the numerator lives on `catalog_ui_policy`, the denominator on `sc_cat_item`. No current collector handles this.

**Capability B — average of a grouped count.**
Example: "average variables per catalog item." This is `AVG(COUNT(item_option_new) GROUP BY cat_item)`. Current collectors can do `COUNT` or `AVG` of a field, but not `AVG(COUNT)`.

Also: "average client scripts per item," "average UI policies per item," "average subflow calls per flow."

### 5.2 New Script Include: `MAFCrossTableRatioCollector`

**Purpose:** compute `count(numerator_filter on numerator_table) / count(denominator_filter on denominator_table) * 100`. Generalizes `MAFWindowedRatioCollector` by allowing the two counts to come from different tables.

**Location:** `x_maf_core.MAFCrossTableRatioCollector`, extends `MAFMetricCollectorBase`.

**`script_params` JSON schema:**

```json
{
  "numerator_table": "catalog_ui_policy",
  "numerator_filter": "active=true",
  "numerator_distinct_field": "cat_item",
  "denominator_table": "sc_cat_item",
  "denominator_filter": "active=true",
  "denominator_distinct_field": null,
  "empty_denominator_value": 0
}
```

| Param | Required | Default | Notes |
|---|---|---|---|
| `numerator_table` | yes | — | Any table |
| `numerator_filter` | yes | — | Encoded query |
| `numerator_distinct_field` | no | null | If set, uses `count(DISTINCT field)` instead of `count(*)` |
| `denominator_table` | yes | — | Any table |
| `denominator_filter` | yes | — | Encoded query |
| `denominator_distinct_field` | no | null | Same as above |
| `empty_denominator_value` | no | 0 | What to return when denominator = 0 |

**Behavior:**

- Both queries use `GlideAggregate`.
- `count(DISTINCT field)` is implemented via `ga.groupBy(field)` + row iteration (consistent with `MAFDeclarativeCollector._countDistinct`).
- Returns `{value: (num/den)*100, drillDownTable: numerator_table, drillDownQuery: numerator_filter, error: null}`.
- Validates both tables exist and are accessible via `GlideRecord(table).isValid()`. If either fails, returns `{value: null, error: 'table X not available'}`.

**What this does NOT handle:** Cases where the numerator filter needs to *reference* the denominator table (like "items that have at least one flow"). For those, use a dot-walk in the filter if possible (`cat_item.active=true` on `catalog_ui_policy`) or fall back to `MAFDeclarativeCollector` with a single table where the relationship is expressible via encoded query. If neither works, the metric needs a bespoke collector — **flag it in review, don't write one silently.**

### 5.3 New Script Include: `MAFGroupedAverageCollector`

**Purpose:** compute the average count of child records per parent. Specifically: given a child table, a parent reference field on the child, a child filter, and optionally a parent filter, compute `AVG(count(children) GROUP BY parent)`.

**Location:** `x_maf_core.MAFGroupedAverageCollector`, extends `MAFMetricCollectorBase`.

**`script_params` JSON schema:**

```json
{
  "child_table": "item_option_new",
  "parent_field": "cat_item",
  "child_filter": "active=true",
  "parent_table": "sc_cat_item",
  "parent_filter": "active=true",
  "aggregation": "avg",
  "include_zero_parents": true
}
```

| Param | Required | Default | Notes |
|---|---|---|---|
| `child_table` | yes | — | E.g. `item_option_new` (catalog variables) |
| `parent_field` | yes | — | Reference field on child pointing to parent |
| `child_filter` | no | `''` | Encoded query on child table |
| `parent_table` | yes | — | Needed to count parents with zero children |
| `parent_filter` | no | `''` | Encoded query on parent table |
| `aggregation` | no | `avg` | One of `avg`, `median`, `p90`, `max`, `min` |
| `include_zero_parents` | no | true | If true, parents with zero matching children count as 0 in the average. If false, they are excluded |

**Behavior:**

1. Query the parent table with `parent_filter` to build the list of parent sys_ids. This is the denominator set when `include_zero_parents=true`.
2. Query the child table with `child_filter`, group by `parent_field`, aggregate COUNT. Build a map `{parent_sys_id: child_count}`.
3. For each parent sys_id in the denominator set: look up its count in the map, default to 0 if missing (only if `include_zero_parents=true`).
4. Compute the requested aggregation over the resulting numeric array.
5. Cap the parent count at 100,000 — above this, return `{value: null, error: 'grouped average exceeded 100000 parents'}`.

**Drill-down:** `drillDownTable = parent_table`, `drillDownQuery = parent_filter`.

**Why not a generic `AVG(GROUP BY)` — including sums, etc.?** Because `GlideAggregate` already supports that via `addAggregate('AVG', field)` with `groupBy`, and `MAFDeclarativeCollector` can be extended trivially to expose it (in fact, it partially already does). The specific gap is counting rows per group, which needs a manual pass.

### 5.4 Collector count after v3

- `MAFDeclarativeCollector` (v0)
- `MAFDurationCollector` (v2)
- `MAFWindowedRatioCollector` (v2)
- `MAFCrossTableRatioCollector` (v3, new)
- `MAFGroupedAverageCollector` (v3, new)
- `ITSMMTTRCollector` (deprecated, kept for audit)
- `ITSMReopenRateCollector` (deprecated, kept for audit)
- `ITSMRecurringProblemLinkCollector` (legacy, kept)

That's 5 active reusable collectors + 3 deprecated/legacy = 8 total. With ~62 metrics, the ratio is **0.08 active SI/metric**.

---

## 6. New categories

Two new categories are added to `x_maf_core_metric_category` (or whatever your category table is — confirm name; in the v1 XML it's referenced by display_value, so just insert two new records).

### 6.1 `Platform Hygiene`

**Intent:** is the ServiceNow build itself sustainable? Does it use the right tool for the job? Is customization debt under control?

**Weight in overall score:** 0.20 (to be confirmed in §9.4).

**Scope:** Catalog surface metrics, fulfillment mechanism (Flow vs Workflow), client-side implementation choices, variable hygiene, taxonomy, customization debt, notification hygiene, SLA definition health.

### 6.2 `Automation & Reuse`

**Intent:** is automation being used where it should be? Is logic generalized or copy-pasted?

**Weight in overall score:** 0.15 (to be confirmed in §9.4).

**Scope:** AWA adoption, assignment strategy, flow reuse ratio, subflow usage, auto-assignment rate, auto-approval rate, assignment rule count sanity.

---

## 7. New metrics

Format: each block below lists metrics for a theme. Every metric must be addable as a single row in `x_maf_core_metric_definition` using only the collectors listed in §5.4.

Legend for `Collector`:
- **DEC** = `MAFDeclarativeCollector`
- **DUR** = `MAFDurationCollector`
- **WIN** = `MAFWindowedRatioCollector`
- **XT** = `MAFCrossTableRatioCollector` (new)
- **GAVG** = `MAFGroupedAverageCollector` (new)

Every metric needs: `name` (snake_case), `label`, `category`, `collector`, `script_params` or `source_table`+`filter`, `target`, `amber`, `red`, `weight_in_category`, `higher_is_better`, `unit`.

### 7.1 Major Incident Management

| # | name | label | collector | table / filter / params | target / amber / red | higher | unit | category |
|---|---|---|---|---|---|---|---|---|
| MI1 | `major_incident_ratio` | P1 incidents promoted to major incident (%) | DEC | `incident`, filter=`priority=1^major_incident_state!=`, denom=`priority=1`, percentage | 60 / 35 / 15 | true | % | ProcAdh |
| MI2 | `major_incident_mttr_hours` | Major incident MTTR (hours) | DUR | `table=incident`, `filter=state=6^major_incident_state!=`, `start=opened_at`, `end=resolved_at`, `window_field=resolved_at`, `window_days=90`, `unit=hours`, `agg=avg` | 2 / 6 / 12 | false | hours | OpPerf |
| MI3 | `major_incident_communication_plan` | Major incidents with comms plan set (%) | DEC | `incident`, filter=`major_incident_state!=^work_notesISNOTEMPTY`, denom=`major_incident_state!=`, percentage | 95 / 75 / 50 | true | % | ProcAdh |
| MI4 | `major_incident_rate` | Major incident rate per month | DEC | `incident`, filter=`major_incident_state!=^sys_created_on>=javascript:gs.monthsAgoStart(3)`, count, divided externally or use GAVG over months — **use DEC count and mark as "last 90 days" directly** | <10 / 20 / 40 (count) | false | count | OpPerf |

> **MI1 caveat:** `major_incident_state` enum values vary (`accepted`, `proposed`, etc.). The filter `!=` (empty) catches any promoted state. Confirm on target instances.
> **MI3:** this is a proxy. A cleaner signal would be a custom "MI comms plan" checkbox if the instance uses MIM. Document in metric description.
> **MI4:** for simplicity, ship this as a raw 90-day count. If a true rate-per-month is needed later, add `MAFWindowedCountCollector` in a follow-up. Do not implement it in v3.

### 7.2 Catalog Surface Health (Platform Hygiene)

| # | name | label | collector | params | target / amber / red | higher | unit |
|---|---|---|---|---|---|---|---|
| CAT1 | `catalog_item_count` | Active catalog item count (raw) | DEC | `sc_cat_item`, filter=`active=true`, count | informational (no thresholds) | n/a | count |
| CAT2 | `catalog_item_description_populated` | Items with description (%) | DEC | `sc_cat_item`, filter=`active=true^descriptionISNOTEMPTY`, denom=`active=true`, percentage | 95 / 80 / 60 | true | % |
| CAT3 | `catalog_item_picture_populated` | Items with picture set (%) | DEC | `sc_cat_item`, filter=`active=true^pictureISNOTEMPTY`, denom=`active=true`, percentage | 80 / 50 / 25 | true | % |
| CAT4 | `catalog_item_short_description_quality` | Items with short description ≥ 20 chars (%) | DEC | `sc_cat_item`, filter=`active=true^short_descriptionISNOTEMPTY^short_descriptionLIKE____________________`, denom=`active=true`, percentage | 95 / 80 / 60 | true | % |
| CAT5 | `catalog_item_category_populated` | Items with category set (%) | DEC | `sc_cat_item`, filter=`active=true^categoryISNOTEMPTY`, denom=`active=true`, percentage | 98 / 85 / 60 | true | % |
| CAT6 | `catalog_item_abandoned_no_orders_180d` | Active items with zero orders in 180 days (%) | XT | num_table=`sc_cat_item`, num_filter=`active=true^sys_idNOT INjavascript:new GlideAggregate('sc_req_item').addQuery('sys_created_on>=',gs.daysAgoStart(180)).groupBy('cat_item').query(); ...` — **use a different approach: compute via GAVG or skip** | 20 / 40 / 60 | false | % |
| CAT7 | `catalog_item_avg_variables` | Average variables per active item | GAVG | `child_table=item_option_new`, `parent_field=cat_item`, `parent_table=sc_cat_item`, `parent_filter=active=true`, `child_filter=active=true`, `agg=avg` | informational, trend over time | n/a | count |
| CAT8 | `catalog_item_over_20_variables` | Items with >20 variables (%) | GAVG *then* derived — **skip as-is; replace with DEC proxy** see below | | | | |

> **CAT6 is hard without a new collector.** The "zero orders in window" pattern needs an anti-join (items NOT in the set of items that appeared on a recent RITM). This is not expressible declaratively on one table. **Decision: defer CAT6 to v3.5 with a new `MAFAntiJoinCollector`, or skip entirely.** Recommended: skip for v3. Replace with CAT6-alt below.

**CAT6-alt:** `catalog_item_recently_ordered_30d` — percentage of active items that appeared on at least one RITM in 30 days. Expressible as XT: `num_table=sc_req_item`, `num_filter=sys_created_on>=javascript:gs.daysAgoStart(30)`, `num_distinct_field=cat_item`, `denom_table=sc_cat_item`, `denom_filter=active=true`. Thresholds: 70 / 40 / 20 (higher is better — used catalog is healthy catalog).

> **CAT8 is not directly expressible by GAVG** (GAVG returns a single average, not a count-above-threshold). **Decision: skip CAT8 in v3.** If needed later, add a `MAFGroupedCountAboveThresholdCollector` — but honestly the avg in CAT7 is a sufficient smell detector.

**Final catalog metrics shipping in v3:** CAT1, CAT2, CAT3, CAT4, CAT5, CAT6-alt, CAT7. All Platform Hygiene category.

### 7.3 Fulfillment Mechanism: Flow vs Workflow (Automation & Reuse)

| # | name | label | collector | params | target / amber / red | higher | unit |
|---|---|---|---|---|---|---|---|
| FM1 | `catalog_flow_designer_adoption` | Items using Flow Designer (vs legacy workflow) (%) | DEC | `sc_cat_item`, filter=`active=true^flow_designer_flowISNOTEMPTY`, denom=`active=true^workflowISNOTEMPTY^ORflow_designer_flowISNOTEMPTY`, percentage | 90 / 60 / 30 | true | % |
| FM2 | `catalog_legacy_workflow_residual` | Items still pointing to legacy workflow (%) | DEC | `sc_cat_item`, filter=`active=true^workflowISNOTEMPTY`, denom=`active=true`, percentage | 5 / 25 / 50 | false | % |
| FM3 | `catalog_items_no_fulfillment` | Active items with no flow and no workflow (%) | DEC | `sc_cat_item`, filter=`active=true^workflowISEMPTY^flow_designer_flowISEMPTY`, denom=`active=true`, percentage | 5 / 15 / 30 | false | % |
| FM4 | `catalog_flow_reuse_ratio` | Distinct flows per 100 active catalog items | XT | num_table=`sc_cat_item`, num_filter=`active=true^flow_designer_flowISNOTEMPTY`, num_distinct_field=`flow_designer_flow`, denom_table=`sc_cat_item`, denom_filter=`active=true^flow_designer_flowISNOTEMPTY` | 30 / 60 / 90 | false | % |
| FM5 | `catalog_subflow_usage` | Flows that call at least one subflow (%) | XT | num_table=`sys_hub_action_instance`, num_filter=`action_typeLIKEsubflow`, num_distinct_field=`flow`, denom_table=`sys_hub_flow`, denom_filter=`active=true^typeISNOTEMPTY` | 40 / 20 / 5 | true | % |

> **FM1:** the encoded query uses `^OR` — verify syntax on target instance (it should be `^NQ` for NEW QUERY, not `^OR` — the correct ServiceNow syntax is `^NQ` to start a disjunctive branch). **Fix during implementation:** denominator = `active=true^workflowISNOTEMPTY^NQactive=true^flow_designer_flowISNOTEMPTY`.
> **FM4 interpretation:** lower is better. A ratio of 30% means 30 distinct flows per 100 items = ~3 items per flow = good reuse. 90% means nearly 1 flow per item = copy-paste hell. Confirm the direction with stakeholders before locking thresholds.
> **FM5:** `sys_hub_flow` is the flow table, `sys_hub_action_instance` holds action calls. `action_type` distinguishes subflows from native actions. Verify field name on target instance (may be `base_action` or similar in older versions). Document in description.

### 7.4 Client-side Implementation (Platform Hygiene)

| # | name | label | collector | params | target / amber / red | higher | unit |
|---|---|---|---|---|---|---|---|
| CLI1 | `catalog_avg_client_scripts_per_item` | Average catalog client scripts per item | GAVG | `child_table=catalog_script_client`, `parent_field=cat_item`, `parent_table=sc_cat_item`, `parent_filter=active=true`, `child_filter=active=true`, `agg=avg` | informational | n/a | count |
| CLI2 | `catalog_avg_ui_policies_per_item` | Average catalog UI policies per item | GAVG | `child_table=catalog_ui_policy`, `parent_field=cat_item`, `parent_table=sc_cat_item`, `parent_filter=active=true`, `child_filter=active=true`, `agg=avg` | informational | n/a | count |
| CLI3 | `catalog_ui_policy_vs_client_script_ratio` | UI Policies as share of client-side logic (%) | XT | num_table=`catalog_ui_policy`, num_filter=`active=true^cat_item.active=true`, denom_table=`catalog_script_client`, denom_filter=`active=true^cat_item.active=true` — **but this is a ratio, not a share, so recompute** | 150 / 80 / 40 | true | % |
| CLI4 | `incident_form_client_scripts_count` | Client scripts on incident form (raw) | DEC | `sys_script_client`, filter=`table=incident^active=true`, count | <15 / 30 / 50 | false | count |
| CLI5 | `incident_form_ui_policies_count` | UI policies on incident form (raw) | DEC | `sys_ui_policy`, filter=`table=incident^active=true`, count | >10 / 5 / 2 | true | count |

> **CLI3 is tricky.** The honest metric is "for every 100 client scripts on the catalog, how many UI policies exist." High ratios (>100%) mean UI policies dominate = good. But XT computes `num/denom * 100`. So:
> - `num=catalog_ui_policy count`, `denom=catalog_script_client count`, both filtered to active items.
> - Result: "%" is actually "UI policies per 100 client scripts."
> - Target 150 means "1.5x more UI policies than client scripts" = healthy.
> - Target 40 means "client scripts dominate 2.5:1" = smell.
> - **Document in description field: "This metric is a ratio, not a share. Values above 100% are possible and desirable."**

> **CLI4/CLI5 are raw counts, not percentages.** The scoring model already supports this via `unit=count` and `higher_is_better=false/true`. Thresholds treat lower-is-better for CLI4 and higher-is-better for CLI5.

### 7.5 Variable Hygiene (Platform Hygiene)

| # | name | label | collector | params | target / amber / red | higher | unit |
|---|---|---|---|---|---|---|---|
| VAR1 | `variables_with_help_text` | Variables with help text (%) | DEC | `item_option_new`, filter=`active=true^help_textISNOTEMPTY`, denom=`active=true`, percentage | 80 / 50 / 25 | true | % |
| VAR2 | `reference_variables_with_qualifier` | Reference variables with ref qualifier (%) | DEC | `item_option_new`, filter=`active=true^type=8^reference_qualISNOTEMPTY^ORreference_qual_conditionISNOTEMPTY`, denom=`active=true^type=8`, percentage — use `^NQ` for OR branch | 85 / 60 / 30 | true | % |
| VAR3 | `variable_set_reuse_rate` | Items using at least one variable set (%) | XT | num_table=`io_set_item`, num_filter=``, num_distinct_field=`sc_cat_item`, denom_table=`sc_cat_item`, denom_filter=`active=true` | 60 / 30 / 10 | true | % |

> **VAR2:** variable type 8 is Reference in most instances. Verify. Also `reference_qual_condition` is the newer field name. Encoded query needs `^NQ` for disjunction.
> **VAR3:** `io_set_item` is the m2m table between `item_option_new_set` (variable set) and catalog items. Confirm table name on target instance.

### 7.6 Taxonomy (Platform Hygiene)

| # | name | label | collector | params | target / amber / red | higher | unit |
|---|---|---|---|---|---|---|---|
| TAX1 | `taxonomy_exists` | Taxonomy records defined (raw count) | DEC | `taxonomy`, filter=``, count | >1 / 1 / 0 | true | count |
| TAX2 | `taxonomy_topic_depth` | Topics with at least one sub-topic (%) | DEC | `topic`, filter=`parentISNOTEMPTY`, denom=``, percentage | 50 / 20 / 5 | true | % |
| TAX3 | `catalog_items_with_topic` | Active catalog items linked to a topic (%) | XT | num_table=`m2m_connected_content`, num_filter=`content_type=sc_cat_item`, num_distinct_field=`content_id`, denom_table=`sc_cat_item`, denom_filter=`active=true` | 80 / 50 / 20 | true | % |

> **TAX1:** this is really a binary. Score as count with target 1 = amber, >1 = green, 0 = red. The scoring engine's threshold comparator handles this if we set `target=2, amber=1, red=0`. Confirm semantics with `MAFScoringEngine`.
> **TAX3:** the `m2m_connected_content` table connects topics to catalog items. Confirm table name — on some versions it's `topic_content_list` or `m2m_taxonomy_topic_to_content`. Document.

### 7.7 Assignment Strategy (Automation & Reuse)

| # | name | label | collector | params | target / amber / red | higher | unit |
|---|---|---|---|---|---|---|---|
| ASN1 | `awa_adoption` | AWA service channels defined (raw count) | DEC | `awa_service_channel`, filter=`active=true`, count | >2 / 1 / 0 | true | count |
| ASN2 | `awa_assignment_rate` | Assignments via AWA in last 30 days (%) | XT | num_table=`awa_assignment`, num_filter=`sys_created_on>=javascript:gs.daysAgoStart(30)`, denom_table=`incident`, denom_filter=`state=6^resolved_at>=javascript:gs.daysAgoStart(30)` | 40 / 20 / 5 | true | % |
| ASN3 | `assignment_rule_count` | Assignment rules defined (raw count) | DEC | `sysrule_assignment`, filter=`active=true`, count | <20 / 50 / 100 | false | count |
| ASN4 | `data_lookup_for_assignment` | Data Lookup definitions touching assignment (raw count) | DEC | `dl_definition`, filter=`target_tableIN incident,change_request,sc_req_item^active=true`, count | >1 / 0 / 0 | true | count |
| ASN5 | `incident_auto_assigned_rate` | Incidents assigned at creation (%) | DEC | `incident`, filter=`active=false^sys_created_onSAMEASopened_at^assignment_groupISNOTEMPTY`, denom=`active=false`, percentage — **this is a weak proxy** | 70 / 40 / 15 | true | % |

> **ASN5 caveat:** a truly "auto-assigned" incident is one where assignment_group was populated by a rule/flow, not by a user. Detecting this accurately requires auditing `sys_audit` or `sys_journal_field` for the first value of `assignment_group`, which is a big query. **Decision: ship ASN5 as a weak proxy (group populated at creation time) and document the limitation.** A precise version can be added later as a script include collector if stakeholders care.
> **ASN2:** `awa_assignment` table and field names vary by version. Verify.
> **ASN3:** raw count with inverted thresholds — 100+ assignment rules is a smell (too many special cases, likely overlap). Under 20 is usually fine.

### 7.8 Customization Debt (Platform Hygiene)

| # | name | label | collector | params | target / amber / red | higher | unit |
|---|---|---|---|---|---|---|---|
| CD1 | `custom_business_rules_on_incident` | Active custom BRs on incident (raw count) | DEC | `sys_script`, filter=`collection=incident^active=true^sys_package.source!=com.snc.incident`, count — **sys_package.source filter may not work; see note** | <10 / 25 / 50 | false | count |
| CD2 | `custom_client_scripts_on_incident` | Active custom client scripts on incident (raw count) | DEC | `sys_script_client`, filter=`table=incident^active=true^sys_package.source!=com.snc.incident`, count | <10 / 25 / 50 | false | count |
| CD3 | `custom_business_rules_on_change` | Active custom BRs on change_request (raw count) | DEC | `sys_script`, filter=`collection=change_request^active=true^sys_package.source!=com.snc.change_management`, count | <10 / 25 / 50 | false | count |
| CD4 | `modified_oob_business_rules` | OOTB business rules marked as "customer updated" (raw count) | DEC | `sys_script`, filter=`sys_update_name LIKEsys_script_^sys_customer_update=true`, count | 0 / 5 / 20 | false | count |

> **CD1/CD2/CD3 caveat:** filtering by "scope" or "customer-created" is notoriously fiddly in ServiceNow. The cleanest signal is `sys_package.source` (the scope/app the record lives in), but this is a dot-walk that may or may not work in encoded queries depending on version. **Implementation note:** prototype the filter on a target instance before locking it. If dot-walk fails, fall back to `sys_customer_updateISNOTEMPTY` or counting rules in the `global` scope touching the table.
> **CD4:** `sys_customer_update=true` on an OOTB record means a customer has modified it — textbook customization debt signal.

### 7.9 Notification & SLA Definition Hygiene (Platform Hygiene)

| # | name | label | collector | params | target / amber / red | higher | unit |
|---|---|---|---|---|---|---|---|
| NOT1 | `notifications_active_count` | Active notifications touching ITSM tables (raw count) | DEC | `sysevent_email_action`, filter=`active=true^collectionIN incident,problem,change_request,sc_req_item`, count | <50 / 100 / 200 | false | count |
| NOT2 | `notifications_using_templates` | Active ITSM notifications using a template (%) | DEC | `sysevent_email_action`, filter=`active=true^collectionIN incident,problem,change_request,sc_req_item^message_templateISNOTEMPTY`, denom=`active=true^collectionIN incident,problem,change_request,sc_req_item`, percentage | 70 / 40 / 15 | true | % |
| SLA1 | `sla_definitions_with_schedule` | SLA definitions with schedule set (%) | DEC | `contract_sla`, filter=`active=true^scheduleISNOTEMPTY`, denom=`active=true`, percentage | 95 / 80 / 50 | true | % |
| SLA2 | `sla_definitions_with_pause` | SLA definitions with pause condition (%) | DEC | `contract_sla`, filter=`active=true^pause_conditionISNOTEMPTY`, denom=`active=true`, percentage | 60 / 30 / 10 | true | % |

### 7.10 Cross-process CMDB linkage (Data Quality)

| # | name | label | collector | params | target / amber / red | higher | unit |
|---|---|---|---|---|---|---|---|
| CMDB1 | `problem_ci_linked` | Problems with CI linked (%) | DEC | `problem`, filter=`active=true^cmdb_ciISNOTEMPTY`, denom=`active=true`, percentage | 85 / 60 / 30 | true | % |
| CMDB2 | `change_ci_linked` | Changes with CI linked (%) | DEC | `change_request`, filter=`active=true^cmdb_ciISNOTEMPTY`, denom=`active=true`, percentage | 90 / 70 / 40 | true | % |
| CMDB3 | `incident_business_service_linked` | Incidents with business service set (%) | DEC | `incident`, filter=`active=true^business_serviceISNOTEMPTY`, denom=`active=true`, percentage | 80 / 55 / 25 | true | % |

---

## 8. Metric count summary

| Theme | Metrics shipping in v3 | Category |
|---|---|---|
| Major Incident | 4 | OpPerf (MI2, MI4) + ProcAdh (MI1, MI3) |
| Catalog Surface | 7 | Platform Hygiene |
| Fulfillment Mechanism | 5 | Automation & Reuse |
| Client-side | 5 | Platform Hygiene |
| Variable Hygiene | 3 | Platform Hygiene |
| Taxonomy | 3 | Platform Hygiene |
| Assignment Strategy | 5 | Automation & Reuse |
| Customization Debt | 4 | Platform Hygiene |
| Notification & SLA Def | 4 | Platform Hygiene |
| Cross-process CMDB | 3 | Data Quality |
| **Total new** | **43** | |
| **Pre-existing (v2)** | **27** | |
| **Grand total after v3** | **70** | |

Collector ratio: 5 active reusable collectors / 70 metrics = **0.07 SI/metric**. ✓

---

## 9. Category weight redistribution

### 9.1 Data Quality (existing category)

Three new metrics (CMDB1, CMDB2, CMDB3) are added. Existing weights need to be reduced proportionally.

| Metric | v2 weight | v3 weight |
|---|---|---|
| `assignment_group_at_resolve` | 0.25 | 0.15 |
| `incident_category_populated` | 0.20 | 0.15 |
| `incident_ci_linked` | 0.20 | 0.15 |
| `incident_short_description_length` | 0.10 | 0.10 |
| `change_backout_completed` | 0.10 | 0.10 |
| `kb_article_freshness` | 0.10 | 0.10 |
| `kb_orphaned_articles` | 0.05 | 0.05 |
| CMDB1 `problem_ci_linked` | — | 0.07 |
| CMDB2 `change_ci_linked` | — | 0.08 |
| CMDB3 `incident_business_service_linked` | — | 0.05 |
| **Total** | **1.00** | **1.00** ✓ |

### 9.2 Operational Performance (existing category)

Two MI metrics added (MI2, MI4). Rebalance.

| Metric | v2 weight | v3 weight |
|---|---|---|
| `mttr_hours_30d` | 0.15 | 0.12 |
| `reopen_rate_30d` | 0.10 | 0.08 |
| `first_call_resolution_rate` | 0.10 | 0.08 |
| `major_incident_mttr_hours_30d` (v2) | 0.10 | 0.08 |
| `incident_backlog_aged_30d` | 0.05 | 0.05 |
| `problem_backlog_aged_90d` | 0.05 | 0.05 |
| `change_success_rate` | 0.20 | 0.15 |
| `change_unauthorized_rate` | 0.05 | 0.05 |
| `change_lead_time_hours_normal` | 0.05 | 0.05 |
| `ritm_fulfillment_time_hours_30d` | 0.10 | 0.08 |
| `ritm_approval_cycle_time_hours` | 0.05 | 0.05 |
| MI2 `major_incident_mttr_hours` | — | 0.08 |
| MI4 `major_incident_rate` | — | 0.08 |
| **Total** | **1.00** | **1.00** ✓ |

> **Note on MI2 vs existing `major_incident_mttr_hours_30d`:** v2 already has `major_incident_mttr_hours_30d` (from my previous PRD). MI2 here is effectively a replacement with a 90-day window instead of 30-day. **Action:** either merge them (keep v2's, drop MI2) or keep both and distinguish by name. **Recommendation: merge.** Rename v2's metric to `major_incident_mttr_hours` and change its window to 90 days. Drop MI2 from this PRD. Weights above assume MI2 stays distinct; if merged, redistribute MI2's 0.08 proportionally across the others.

### 9.3 Process Adherence (existing category)

Two MI metrics added (MI1, MI3). Rebalance.

| Metric | v2 weight | v3 weight |
|---|---|---|
| `sla_attainment_incident` | 0.20 | 0.15 |
| `recurring_incidents_problem_link` | 0.05 | 0.05 |
| `incident_reassignment_low` | 0.10 | 0.08 |
| `problem_root_cause_identified` | 0.15 | 0.12 |
| `problem_known_error_rate` | 0.05 | 0.05 |
| `change_emergency_ratio` | 0.10 | 0.08 |
| `change_cab_required_approved` | 0.10 | 0.08 |
| `sla_attainment_ritm` | 0.20 | 0.15 |
| `incident_kb_attached_at_resolve` | 0.05 | 0.04 |
| MI1 `major_incident_ratio` | — | 0.10 |
| MI3 `major_incident_communication_plan` | — | 0.10 |
| **Total** | **1.00** | **1.00** ✓ |

### 9.4 Platform Hygiene (NEW category, 0.20 overall weight)

| Metric | v3 weight |
|---|---|
| CAT1 `catalog_item_count` (informational, weight 0) | 0.00 |
| CAT2 `catalog_item_description_populated` | 0.06 |
| CAT3 `catalog_item_picture_populated` | 0.03 |
| CAT4 `catalog_item_short_description_quality` | 0.05 |
| CAT5 `catalog_item_category_populated` | 0.06 |
| CAT6-alt `catalog_item_recently_ordered_30d` | 0.05 |
| CAT7 `catalog_item_avg_variables` (informational, weight 0) | 0.00 |
| CLI1 `catalog_avg_client_scripts_per_item` (informational) | 0.00 |
| CLI2 `catalog_avg_ui_policies_per_item` (informational) | 0.00 |
| CLI3 `catalog_ui_policy_vs_client_script_ratio` | 0.08 |
| CLI4 `incident_form_client_scripts_count` | 0.05 |
| CLI5 `incident_form_ui_policies_count` | 0.05 |
| VAR1 `variables_with_help_text` | 0.04 |
| VAR2 `reference_variables_with_qualifier` | 0.06 |
| VAR3 `variable_set_reuse_rate` | 0.06 |
| TAX1 `taxonomy_exists` | 0.03 |
| TAX2 `taxonomy_topic_depth` | 0.04 |
| TAX3 `catalog_items_with_topic` | 0.06 |
| CD1 `custom_business_rules_on_incident` | 0.06 |
| CD2 `custom_client_scripts_on_incident` | 0.05 |
| CD3 `custom_business_rules_on_change` | 0.05 |
| CD4 `modified_oob_business_rules` | 0.06 |
| NOT1 `notifications_active_count` | 0.03 |
| NOT2 `notifications_using_templates` | 0.03 |
| SLA1 `sla_definitions_with_schedule` | 0.03 |
| SLA2 `sla_definitions_with_pause` | 0.02 |
| **Total** | **1.00** ✓ |

> **Weighted vs informational metrics:** CAT1, CAT7, CLI1, CLI2 have `weight_in_category=0.00` — they are shown in reports for context but do not contribute to the score. The scoring engine must handle zero-weight metrics without dividing by zero. Verify `MAFScoringEngine` tolerates this.

### 9.5 Automation & Reuse (NEW category, 0.15 overall weight)

| Metric | v3 weight |
|---|---|
| FM1 `catalog_flow_designer_adoption` | 0.18 |
| FM2 `catalog_legacy_workflow_residual` | 0.14 |
| FM3 `catalog_items_no_fulfillment` | 0.10 |
| FM4 `catalog_flow_reuse_ratio` | 0.15 |
| FM5 `catalog_subflow_usage` | 0.10 |
| ASN1 `awa_adoption` | 0.08 |
| ASN2 `awa_assignment_rate` | 0.10 |
| ASN3 `assignment_rule_count` | 0.05 |
| ASN4 `data_lookup_for_assignment` | 0.05 |
| ASN5 `incident_auto_assigned_rate` | 0.05 |
| **Total** | **1.00** ✓ |

### 9.6 Overall category weights (new structure)

| Category | v2 weight | v3 weight |
|---|---|---|
| Data Quality | 0.25 | 0.20 |
| Operational Performance | 0.40 | 0.25 |
| Process Adherence | 0.35 | 0.20 |
| Platform Hygiene | — | 0.20 |
| Automation & Reuse | — | 0.15 |
| **Total** | **1.00** | **1.00** ✓ |

> **These overall weights are a judgment call.** I've deliberately given the new categories 0.35 combined weight so platform hygiene is visible in the top-line score without dominating it. If stakeholders want a "process-first" view, bump OpPerf and ProcAdh back up. If they want a "build-first" view, bump Platform Hygiene to 0.30.

---

## 10. Implementation plan

### Phase 1 — Collector layer (days 1–2)
1. Create `x_maf_core.MAFCrossTableRatioCollector` per §5.2.
2. Create `x_maf_core.MAFGroupedAverageCollector` per §5.3.
3. Extend `MAFCollectorTestFixtures` with synthetic-data tests for both. Minimum coverage: one happy path, one zero-denominator, one missing-table, one parent-with-zero-children.

### Phase 2 — Category creation (day 2)
4. Insert `Platform Hygiene` and `Automation & Reuse` rows into the category table.
5. Capture their sys_ids for use in metric definitions.
6. Verify `MAFScoringEngine` handles 5 categories (it should — v2 already has 3, and the engine should iterate). If the engine hardcodes the three v2 categories anywhere, fix that first.
7. Verify `MAFScoringEngine` tolerates `weight_in_category=0.00` for informational metrics. If it divides by zero, patch.

### Phase 3 — Metric rows (days 3–5)
8. Insert all 43 new metric definitions from §7. Use this order (dependency-free themes first, risky ones last):
   1. §7.10 cross-process CMDB (simplest, pure DEC)
   2. §7.2 catalog surface health
   3. §7.5 variable hygiene
   4. §7.9 notification & SLA def
   5. §7.3 fulfillment mechanism (Flow vs Workflow) — has instance-dependent table names, test first
   6. §7.4 client-side implementation
   7. §7.6 taxonomy — table names vary most by version
   8. §7.7 assignment strategy — AWA tables vary
   9. §7.8 customization debt — dot-walk on `sys_package.source` is fragile
   10. §7.1 major incident — MI2 merge decision (see §9.2)
9. For each metric, after insertion, run the collector once in isolation via the test fixtures runner and confirm it returns either a numeric value or a clear error — never silently 0 or null without an error message.

### Phase 4 — Weight redistribution (day 5)
10. Update all existing metric `weight_in_category` values per §9.1–§9.3.
11. Update overall category weights per §9.6. (This may require a change to wherever category-level weights are stored — confirm this is a table column and not hardcoded.)

### Phase 5 — Verification (day 6)
12. Run a full assessment on a dev instance. Capture the run's `x_maf_core_assessment_run` sys_id.
13. For every metric that returns `error != null`, triage:
    - If the error is "field X not available on this instance" → document in metric description, leave metric active, let it score as null (the engine should treat null as skip-from-scoring).
    - If the error is a syntax error in the encoded query → fix.
    - If the error is an exception in the collector → fix collector, not metric.
14. Confirm all 5 category scores fall in 0–100.
15. Confirm overall score is a sane number and not NaN.

### Phase 6 — Export & commit (day 7)
16. Export updated `x_maf_core_metric_definition.xml` and `sys_script_include.xml`.
17. Document the 5-category structure in the project README.

---

## 11. Acceptance criteria

- [ ] `MAFCrossTableRatioCollector` and `MAFGroupedAverageCollector` exist and pass fixture tests.
- [ ] No new per-metric script include is created for any metric in §7.
- [ ] Two new categories (`Platform Hygiene`, `Automation & Reuse`) exist with the weights in §9.6.
- [ ] All 43 new metric rows from §7 exist and are active (with documented exceptions for MI2 if merged).
- [ ] All 5 categories' metric weights sum to exactly 1.00 (verified by the pre-commit sanity check).
- [ ] Overall category weights sum to 1.00.
- [ ] A full assessment run completes without collector-level exceptions. Metric-level "field not available" errors are acceptable if documented.
- [ ] `MAFScoringEngine` correctly handles 5 categories and informational (weight 0) metrics.
- [ ] SI-per-metric ratio ≤ 0.11 after v3 (target: 0.07).
- [ ] Exported XML files committed.

---

## 12. Open questions / instance-dependent decisions

1. **Category table structure.** Is `x_maf_core_metric_category` an actual table, or are categories hardcoded anywhere? Confirm before Phase 2.
2. **Overall category weights** in §9.6 are a judgment call. Stakeholder review needed.
3. **Table name verification** required before locking these metrics:
   - `io_set_item` (variable set m2m) — VAR3
   - `m2m_connected_content` or equivalent (topic-to-item m2m) — TAX3
   - `awa_assignment`, `awa_service_channel` — ASN1, ASN2
   - `sys_hub_action_instance.action_type` vs `base_action` — FM5
4. **Encoded query syntax for disjunction.** ServiceNow uses `^NQ` (NEW QUERY), not `^OR`, for OR branches. All metrics in §7 using `^OR` in my shorthand must be rewritten with `^NQ` during implementation.
5. **`sys_package.source` dot-walk in encoded queries.** Fragile. Test on target instance for CD1/CD2/CD3. Fall back to `sys_customer_updateISNOTEMPTY` or scope-based filters if dot-walk fails.
6. **MI2 vs v2's `major_incident_mttr_hours_30d`.** Merge recommendation in §9.2. Confirm with stakeholders.
7. **ASN5 proxy limitation.** Weak signal. Document in description field. Precise version deferred.
8. **Informational metrics (weight 0).** Confirm `MAFScoringEngine` behavior.

---

## 13. Known limitations / deferred to future PRDs

- **Script-content scanning** (regex over `script` fields to detect hardcoded sys_ids, deprecated APIs, `GlideRecord` inside client scripts, etc.) — requires a new collector type that reads `script` fields as text and applies pattern matching. Separate PRD.
- **Audit-history-based metrics** (true "auto-assigned at creation" by inspecting `sys_audit` / `sys_journal_field`) — needs a new collector that can walk audit history. Separate PRD.
- **Trend metrics** (delta vs previous assessment run) — requires scoring engine changes. Separate PRD.
- **Anti-join metrics** (items NOT in set X) — needed for CAT6 "abandoned items." Add `MAFAntiJoinCollector` in a future pass if stakeholders care.
- **Threshold-count metrics** (items with >N variables, flows with >N actions) — needs `MAFGroupedCountAboveThresholdCollector`. Skip for v3; the averages in GAVG are usually sufficient.
- **Predictive Intelligence / ML adoption** — separate "AI Ops" pack.
- **Notification unsubscribe/compliance** — depends on instance configuration; separate "Compliance" pack.
- **Update set discipline** metrics — cross-cutting concern, not ITSM-specific; separate "DevOps" pack.
- **Scoring sub-categories / metric groups** — structural change to the scoring engine. Separate PRD. Flagged as necessary once the pack hits ~100 metrics.

---

## 14. Rollback plan

If v3 causes assessment run failures or score regressions:

1. Set all 43 new metric rows to `active=false`. The old 27-metric pack continues to run.
2. Set the two new categories to `active=false` (or equivalent).
3. Revert category weights in `x_maf_core_metric_category` to v2 values (Data Quality 0.25, OpPerf 0.40, ProcAdh 0.35).
4. The two new collectors (`MAFCrossTableRatioCollector`, `MAFGroupedAverageCollector`) can remain installed — they cause no harm when unused.

Rollback is additive-only: no v2 metric is modified destructively, only weighted down. Restoring v2 weights fully reverts scoring behavior.
