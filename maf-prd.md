# PRD — Maturity Assessment Framework (MAF)

**Target runtime:** ServiceNow (Zurich or later)
**Build tooling:** ServiceNow SDK (`now-sdk`) with Fluent metadata + JavaScript Script Includes
**Delivery format:** One scoped application (the framework) + one pack shipped as an Update Set

---

## 1. Context for the coding agent

You are building a **generic, extensible maturity assessment framework** for ServiceNow. It is *not* an ITSM-specific app. ITSM is the first content pack, but the framework must accept additional packs (ITOM, HRSD, CSM, Security Ops, …) without any schema changes.

The framework is one scoped app. Packs are **data-only** — they live as records in the framework's own tables and are distributed as Update Sets. A pack may reference Script Includes that live in the framework scope, added by pack authors.

Do not create any pack-specific tables, fields, or scopes. If you feel the urge to add an `x_maf_itsm_*` table, stop and re-read this section.

---

## 2. Goals and non-goals

**Goals**
- A framework that lets a business analyst define maturity metrics declaratively, with a code escape hatch when needed.
- Category-level scoring per pack (e.g. "ITSM → Data Quality: 81%").
- Assessment runs that capture a point-in-time snapshot of all metrics for one or more packs.
- One AI-generated executive summary per run, with a pluggable provider (stub, Now Assist Skill Kit, or generic REST).
- Out-of-the-box Platform Dashboard with reports for visualization. **Do not build a custom UI Page, Service Portal widget, or UI Builder experience in v1.**
- An ITSM pack covering ~10 Incident-focused metrics across three categories.

**Non-goals (v1)**
- Per-process time-series trending beyond what Platform Analytics / Performance Analytics gives for free.
- Scheduled recurring runs (the scheduler stub is included but enablement is manual).
- Pack marketplace / installer UI.
- Any pack beyond ITSM.
- Any modifications to global-scope tables. Collectors read only.

---

## 3. Terminology

| Term | Meaning |
|---|---|
| **Framework** | The scoped app `x_maf_core` containing tables, Script Includes, UI actions, dashboards. |
| **Pack** | A set of data records (Pack, Categories, Metric Definitions, optional Script Includes) distributed as an Update Set. |
| **Assessment Run** | One execution instance that collects metric values for one or more packs at a point in time. |
| **Metric Definition** | A reusable specification of what to measure and how. |
| **Metric Result** | The value a metric produced during one Assessment Run. |
| **Category Score** | The rolled-up weighted score for one Category within one Assessment Run. |
| **Collector** | The thing that turns a Metric Definition into a numeric value. Either declarative (config-driven) or a Script Include. |

---

## 4. Application metadata

- **Name:** Maturity Assessment Framework
- **Scope:** `x_maf_core`
- **Version:** `1.0.0`
- **Short description:** Generic, pack-based maturity assessment framework for ServiceNow.
- **Roles to create:**
  - `x_maf_core.admin` — full CRUD on all MAF tables, can execute runs.
  - `x_maf_core.user` — read on all MAF tables, can execute runs.
  - `x_maf_core.viewer` — read-only on Assessment Runs, Metric Results, Category Scores, AI Summaries.

---

## 5. Data model

Create seven tables. All fields are in the `x_maf_core` scope. All references use the scoped naming convention (e.g. `x_maf_core_pack`). Use Fluent table definitions in `src/server/tables/`.

### 5.1 `x_maf_core_pack` — Pack

| Field | Type | Notes |
|---|---|---|
| `name` | String (40) | Unique. Machine name. e.g. `itsm`. |
| `label` | String (80) | Display name. e.g. `IT Service Management`. |
| `description` | String (4000) | |
| `version` | String (20) | Semver. |
| `vendor` | String (80) | Who authored the pack. |
| `active` | True/False | Default true. |
| `order` | Integer | Display order. |

Display value: `label`. Add a uniqueness index on `name`.

### 5.2 `x_maf_core_category` — Category

| Field | Type | Notes |
|---|---|---|
| `pack` | Reference → `x_maf_core_pack` | Mandatory, cascade delete. |
| `name` | String (40) | Unique within pack. |
| `label` | String (80) | |
| `description` | String (4000) | |
| `weight` | Decimal (5,2) | 0.00–1.00. Contribution to pack score. |
| `order` | Integer | |

Display value: `label`. Uniqueness index on (`pack`, `name`).

### 5.3 `x_maf_core_metric_definition` — Metric Definition

| Field | Type | Notes |
|---|---|---|
| `category` | Reference → `x_maf_core_category` | Mandatory. Cascade delete. |
| `name` | String (60) | Unique within category. |
| `label` | String (120) | |
| `description` | String (4000) | |
| `collector_type` | Choice | `declarative`, `script_include` |
| `source_table` | String (80) | Used when `collector_type=declarative`. |
| `filter_condition` | String (4000) | Encoded query. |
| `aggregation` | Choice | `count`, `count_distinct`, `sum`, `avg`, `percentage` |
| `aggregation_field` | String (80) | For `sum`, `avg`, `count_distinct`. |
| `denominator_filter` | String (4000) | Encoded query. For `percentage` numerator/denominator pattern. |
| `script_include` | String (120) | Class name of the collector for `collector_type=script_include`. Not a reference — name only, to allow packs to ship new Script Includes via Update Set. |
| `script_params` | String (4000) | JSON string passed to the collector. |
| `target_value` | Decimal (10,2) | Mature target. |
| `threshold_red` | Decimal (10,2) | Below this = red. |
| `threshold_amber` | Decimal (10,2) | Between red and amber = amber; above = green. |
| `higher_is_better` | True/False | If false, thresholds invert. |
| `weight_in_category` | Decimal (5,2) | 0.00–1.00. |
| `unit` | String (20) | e.g. `%`, `hours`, `count`. |
| `active` | True/False | Default true. |

Display value: `label`. Uniqueness index on (`category`, `name`).

### 5.4 `x_maf_core_assessment_run` — Assessment Run

| Field | Type | Notes |
|---|---|---|
| `number` | String (40) | Auto-numbered `MAF0001000`. |
| `name` | String (120) | User-supplied label. |
| `state` | Choice | `draft`, `running`, `collected`, `scored`, `summarized`, `complete`, `error` |
| `packs` | List → `x_maf_core_pack` | Glide list. Which packs were run. |
| `started_at` | Date/Time | |
| `completed_at` | Date/Time | |
| `triggered_by` | Reference → `sys_user` | |
| `error_message` | String (4000) | |
| `overall_notes` | String (4000) | |

Display value: `number` with `name` in dot-walking.

### 5.5 `x_maf_core_metric_result` — Metric Result

| Field | Type | Notes |
|---|---|---|
| `assessment_run` | Reference → `x_maf_core_assessment_run` | Cascade delete. |
| `metric_definition` | Reference → `x_maf_core_metric_definition` | Restrict delete. |
| `raw_value` | Decimal (15,4) | |
| `normalized_score` | Decimal (5,2) | 0–100. |
| `rag_status` | Choice | `red`, `amber`, `green`, `error` |
| `collection_error` | String (4000) | Populated when a single metric fails. |
| `drill_down_query` | String (4000) | Encoded query to view source records. |
| `drill_down_table` | String (80) | Companion to `drill_down_query`. |
| `collected_at` | Date/Time | |

Index on (`assessment_run`, `metric_definition`).

### 5.6 `x_maf_core_category_score` — Category Score

| Field | Type | Notes |
|---|---|---|
| `assessment_run` | Reference → `x_maf_core_assessment_run` | Cascade delete. |
| `category` | Reference → `x_maf_core_category` | |
| `score` | Decimal (5,2) | 0–100 weighted average. |
| `rag_status` | Choice | `red`, `amber`, `green` |
| `metrics_total` | Integer | |
| `metrics_green` | Integer | |
| `metrics_amber` | Integer | |
| `metrics_red` | Integer | |
| `metrics_error` | Integer | |

Index on (`assessment_run`, `category`).

### 5.7 `x_maf_core_ai_summary` — AI Summary

| Field | Type | Notes |
|---|---|---|
| `assessment_run` | Reference → `x_maf_core_assessment_run` | Unique. Cascade delete. |
| `provider` | Choice | `stub`, `now_assist`, `rest_llm` |
| `executive_summary` | HTML | |
| `top_recommendations` | String (8000) | JSON array. |
| `generated_at` | Date/Time | |
| `token_count` | Integer | Optional. |
| `error` | String (4000) | |

---

## 6. Script Includes

All Script Includes live in `src/server/script-includes/`. Each is a classic ServiceNow `Class.create()` prototype. All are **not** client-callable unless noted.

### 6.1 `MAFMetricCollectorBase` — abstract base

```javascript
var MAFMetricCollectorBase = Class.create();
MAFMetricCollectorBase.prototype = {
  initialize: function(metricDefGR, assessmentRunGR) {
    this.metricDef = metricDefGR;
    this.run = assessmentRunGR;
    this.params = {};
    var raw = metricDefGR.getValue('script_params');
    if (raw) {
      try { this.params = JSON.parse(raw); } catch (e) { this.params = {}; }
    }
  },
  // Contract: return { value: Number, drillDownTable: String|null, drillDownQuery: String|null, error: String|null }
  collect: function() {
    throw 'collect() must be implemented by subclass';
  },
  type: 'MAFMetricCollectorBase'
};
```

Pack Script Include collectors extend this. Example signature the framework will call:

```javascript
var collector = new global[className](metricDefGR, runGR); // className comes from metric_definition.script_include
var result = collector.collect();
```

Note: because packs are data-only and ship Script Includes through the Update Set, class names live in the `x_maf_core` scope. Use the `x_maf_core` namespace, not `global`, when instantiating. Write a small factory helper:

```javascript
// In MAFCollectorFactory
getCollector: function(className, metricDefGR, runGR) {
  var ClassRef = this._resolveClass(className);
  if (!ClassRef) throw 'Collector class not found: ' + className;
  return new ClassRef(metricDefGR, runGR);
}
```

Resolve the class via `GlideScopedEvaluator` or a `gs.include()` + lookup. See the Dev Guide in `docs/collector-authoring.md` you will also produce.

### 6.2 `MAFDeclarativeCollector`

A single, generic collector that executes when `metric_definition.collector_type=declarative`. Reads `source_table`, `filter_condition`, `aggregation`, `aggregation_field`, `denominator_filter` from the Metric Definition and builds a `GlideAggregate`. Returns a value and a drill-down query.

Rules:
- `count`: `GlideAggregate.addAggregate('COUNT')`, no field.
- `count_distinct`: `GlideAggregate.addAggregate('COUNT', aggregation_field)` with DISTINCT semantics.
- `sum` / `avg`: `GlideAggregate.addAggregate('SUM'|'AVG', aggregation_field)`.
- `percentage`: run two aggregates. Numerator uses `filter_condition`. Denominator uses `denominator_filter` (if empty, falls back to the full `source_table`). Result is `(num / den) * 100`. If `den=0`, result is `0` and emits no error.
- Drill-down: `drill_down_table = source_table`, `drill_down_query = filter_condition`.
- Must catch exceptions and return `{ error: ... }` instead of throwing.

### 6.3 `MAFAssessmentRunner`

The orchestrator. Entry point: `MAFAssessmentRunner.run(runSysId)`.

Flow:
1. Load the Assessment Run GR. Set `state=running`, `started_at=now`.
2. For each pack in `packs`, load active Metric Definitions by joining through Category.
3. For each Metric Definition, dispatch:
   - `declarative` → `MAFDeclarativeCollector`.
   - `script_include` → look up class via `MAFCollectorFactory`.
4. Wrap each metric in try/catch. On failure, insert a Metric Result with `rag_status=error`, `collection_error=<message>`, and continue.
5. On success, insert a Metric Result with `raw_value`, `normalized_score`, `rag_status`, and drill-down fields.
6. After all metrics, call `MAFScoringEngine.scoreRun(runSysId)` to compute Category Scores. Set `state=scored`.
7. Call `MAFAISummaryProvider.generate(runSysId)`. Set `state=summarized`.
8. Set `state=complete`, `completed_at=now`.
9. On fatal orchestration failure, set `state=error` and populate `error_message`.

This must run in the background for long runs. Use `GlideRecordSimpleProgressWorker` or a scheduled script execution record triggered by the UI Action.

### 6.4 `MAFScoringEngine`

Two responsibilities.

**Normalize a single raw value to 0–100:**
```
if higher_is_better:
  if raw <= threshold_red: score is 0..33 scaled by proximity to 0
  elif raw <= threshold_amber: score is 34..66
  else if raw >= target_value: score is 100
  else: score is 67..99 interpolated between threshold_amber and target_value
else:
  (inverse — lower values are better)
```
Use linear interpolation inside each band. RAG assignment:
- `>= threshold_amber` AND `higher_is_better` → green (and vice versa).
- Between → amber.
- Worse than `threshold_red` → red.

**Compute Category Scores for a run:**
- For each Category in the run's packs, fetch all Metric Results for that Category.
- `score = sum(normalized_score * weight_in_category) / sum(weight_in_category)` — ignoring `error` results in the denominator.
- `rag_status` from score: `>= 75 green`, `>= 50 amber`, else `red`. (Thresholds in system properties.)
- Count metrics by RAG into `metrics_green`, `metrics_amber`, `metrics_red`, `metrics_error`.
- Insert one Category Score row per category.

### 6.5 `MAFAISummaryProvider`

Strategy pattern. Reads system property `x_maf_core.ai_provider` (values: `stub`, `now_assist`, `rest_llm`, default `stub`).

Entry: `generate(runSysId)`. Builds a payload JSON:

```json
{
  "run": { "number": "...", "name": "...", "started_at": "..." },
  "packs": [
    {
      "name": "itsm",
      "label": "IT Service Management",
      "categories": [
        {
          "name": "data_quality",
          "label": "Data Quality",
          "score": 81,
          "rag": "green",
          "metrics": [
            { "name": "incident_category_populated", "label": "Incident category populated", "value": 94, "unit": "%", "target": 98, "rag": "amber" }
          ]
        }
      ]
    }
  ]
}
```

Dispatch to one of:

- **`_generateStub(payload)`** — template-based. Produces an HTML executive summary that lists each pack, its weakest category, its lowest-scoring metric, and a canned recommendation per RAG. Ships enabled by default so the app works out of the box with zero AI infra.
- **`_generateNowAssist(payload)`** — calls a Now Assist Skill Kit skill named `x_maf_core_summarize_assessment`. You do **not** need to build the skill itself; just stub this method so it errors with a clear "Skill Kit integration not yet configured" message unless the skill exists. Leave a TODO comment with the API pattern.
- **`_generateRestLLM(payload)`** — calls a REST message record named `x_maf_core_llm_generate`. Same stubbing rule.

All three write to `x_maf_core_ai_summary` with provider, `executive_summary` (HTML), `top_recommendations` (JSON array of `{title, rationale, effort, impact, related_metrics}`), and `generated_at`.

---

## 7. UI surfaces (OOTB only)

### 7.1 Application navigator

Create an application menu **Maturity Assessment** with modules:
- **Assessment Runs** → list of `x_maf_core_assessment_run`.
- **New Assessment Run** → new record on `x_maf_core_assessment_run`.
- **Packs** → list of `x_maf_core_pack`.
- **Metric Definitions** → list of `x_maf_core_metric_definition`.
- **Category Scores** → list of `x_maf_core_category_score`.
- **Metric Results** → list of `x_maf_core_metric_result`.
- **Dashboards** → link to the MAF dashboard (section 7.3).
- **Properties** → `x_maf_core.*` system properties (section 8).

### 7.2 UI Actions on Assessment Run

- **Execute Run** — visible when `state=draft`. Calls `MAFAssessmentRunner.run(current.sys_id)` in the background. Shows an info message "Run started" and reloads.
- **View Dashboard** — opens the dashboard filtered to `assessment_run=current.sys_id`.

### 7.3 Dashboard and reports

Create a Platform Dashboard named **Maturity Assessment Overview**. Tabs:

- **Summary tab** — one single-score report per pack (Category Score average). Plus one bar chart of Category Scores grouped by category, one per pack.
- **Details tab** — one bar chart of Metric Results grouped by Category. Plus a list widget of Metric Results with RAG coloring.
- **AI Summary tab** — a report widget showing the `executive_summary` HTML from `x_maf_core_ai_summary` for the selected run. (A simple related-list approach on the Assessment Run form is also acceptable.)

All reports accept a dashboard filter on `assessment_run`. Build them as standard Reports against the MAF tables. **Do not build PA indicators in v1** — add a follow-up note in the README that indicators can be added later if the customer has a PA license.

### 7.4 Form layouts

- **Assessment Run form**: show `number`, `name`, `state`, `packs`, `started_at`, `completed_at`, `triggered_by`, `error_message`, `overall_notes`. Related lists: Metric Results, Category Scores, AI Summary.
- **Metric Definition form**: use UI Policies to show declarative fields only when `collector_type=declarative` and script fields only when `collector_type=script_include`.

---

## 8. System properties

Create these under `sys_properties` in the `x_maf_core` scope:

| Name | Type | Default | Purpose |
|---|---|---|---|
| `x_maf_core.ai_provider` | choice | `stub` | Which AI provider to use. Values: `stub`, `now_assist`, `rest_llm`. |
| `x_maf_core.score_threshold_green` | integer | `75` | Category score >= this = green. |
| `x_maf_core.score_threshold_amber` | integer | `50` | Category score >= this = amber. |
| `x_maf_core.max_concurrent_runs` | integer | `1` | Guard rail for orchestrator. |
| `x_maf_core.rest_llm_message` | string | `x_maf_core_llm_generate` | REST message record name for REST LLM provider. |

---

## 9. Security (ACLs)

For each MAF table:
- `read`: `x_maf_core.viewer`, `x_maf_core.user`, `x_maf_core.admin`
- `write` / `create` / `delete`: `x_maf_core.admin` only
- Exception: `x_maf_core_assessment_run` — `create` allowed for `x_maf_core.user` (so regular users can start runs).

Application access settings: allow other applications to read framework tables (packs will be distributed as update sets in the framework's own scope, so this is mostly a safety net). Do not allow cross-scope writes.

---

## 10. ITSM content pack — data to seed

Deliver the ITSM pack as a second Update Set built from records in the framework tables. Include one Pack, three Categories, ~10 Metric Definitions, and any Script Includes the script-based metrics need.

### Pack record

- `name=itsm`, `label=IT Service Management`, `version=1.0.0`, `vendor=MAF Core`, `active=true`, `order=100`.

### Categories

| name | label | weight | order |
|---|---|---|---|
| `data_quality` | Data Quality | 0.30 | 1 |
| `operational` | Operational Performance | 0.40 | 2 |
| `process_adherence` | Process Adherence | 0.30 | 3 |

### Metric Definitions

All `active=true`, `unit` and `higher_is_better` as noted.

**Data Quality (all declarative, percentage)**

1. **Incident category populated**
   `source_table=incident`, `filter_condition=active=true^category!=NULL`, `denominator_filter=active=true`, `aggregation=percentage`, `target=98`, `red=70`, `amber=85`, `higher_is_better=true`, `weight=0.25`.
2. **Incident CI linked**
   `filter_condition=active=true^cmdb_ci!=NULL`, same pattern. `target=90`, `red=50`, `amber=75`, `weight=0.25`.
3. **Short description length >= 20**
   `filter_condition=active=true^short_descriptionISNOTEMPTY^short_descriptionLIKE____________________` (20 underscores). `target=95`, `red=60`, `amber=80`, `weight=0.20`. Or use a script collector if LIKE is brittle.
4. **Assignment group set at resolve**
   `filter_condition=state=6^assignment_group!=NULL`, `denominator_filter=state=6`. `target=99`, `red=85`, `amber=95`, `weight=0.30`.

**Operational Performance**

5. **Reopen rate (last 30 days)** — **script**, class `ITSMReopenRateCollector`, `script_params={"window_days":30}`. `target=2`, `red=15`, `amber=7`, `higher_is_better=false`, `weight=0.35`.
6. **Mean time to resolve (hours)** — **script**, class `ITSMMTTRCollector`, `script_params={"window_days":30}`. `target=8`, `red=48`, `amber=24`, `higher_is_better=false`, `weight=0.35`.
7. **First call resolution rate** — declarative percentage. `filter_condition=state=6^resolved_by=sys_created_by`, `denominator_filter=state=6`. `target=65`, `red=25`, `amber=45`, `weight=0.30`.

**Process Adherence**

8. **SLA attainment** — declarative percentage on `task_sla`. `filter_condition=has_breached=false^task.sys_class_name=incident`, `denominator_filter=task.sys_class_name=incident`. `target=98`, `red=80`, `amber=90`, `weight=0.40`.
9. **Recurring incidents linked to problem** — **script**, class `ITSMRecurringProblemLinkCollector`. Counts incidents with matching `short_description` occurring >= 3 times in 90 days and checks `problem_id!=NULL`. `target=80`, `red=30`, `amber=55`, `weight=0.30`.
10. **Incidents closed via KB** — declarative percentage. `source_table=incident`, `filter_condition=state=6^close_code=Solved (Work Around)^ORclose_code=Solved Permanently` combined with a join condition on `kb_use`; if too complex, make this a script collector. `target=60`, `red=15`, `amber=35`, `weight=0.30`.

### Script Includes needed in the pack

Create these in `src/server/script-includes/` alongside the framework ones. They extend `MAFMetricCollectorBase`.

- `ITSMReopenRateCollector`
- `ITSMMTTRCollector`
- `ITSMRecurringProblemLinkCollector`

Document each with JSDoc comments describing the metric, the query, and any assumptions.

---

## 11. Project structure (Now SDK)

Scaffold the app using `now-sdk create` with scope `x_maf_core`. The resulting tree should look like:

```
maturity-assessment-framework/
├── now.config.json
├── package.json
├── README.md
├── docs/
│   ├── collector-authoring.md
│   └── pack-authoring.md
└── src/
    ├── server/
    │   ├── tables/
    │   │   ├── pack.ts              # Fluent table defs
    │   │   ├── category.ts
    │   │   ├── metric-definition.ts
    │   │   ├── assessment-run.ts
    │   │   ├── metric-result.ts
    │   │   ├── category-score.ts
    │   │   └── ai-summary.ts
    │   ├── script-includes/
    │   │   ├── MAFMetricCollectorBase.js
    │   │   ├── MAFDeclarativeCollector.js
    │   │   ├── MAFCollectorFactory.js
    │   │   ├── MAFAssessmentRunner.js
    │   │   ├── MAFScoringEngine.js
    │   │   ├── MAFAISummaryProvider.js
    │   │   ├── ITSMReopenRateCollector.js
    │   │   ├── ITSMMTTRCollector.js
    │   │   └── ITSMRecurringProblemLinkCollector.js
    │   ├── ui-actions/
    │   │   ├── assessment-run-execute.ts
    │   │   └── assessment-run-view-dashboard.ts
    │   └── roles/
    │       └── roles.ts
    └── data/
        └── itsm-pack/                 # seeded as an Update Set for the ITSM pack
            ├── pack.xml
            ├── categories.xml
            └── metric-definitions.xml
```

Use Fluent TypeScript for table metadata, roles, and UI actions. Use plain JavaScript for Script Includes (ServiceNow runtime is Rhino-based; keep ES5 syntax in Script Includes). Run `now-sdk build` and `now-sdk deploy` after each implementation phase.

---

## 12. Implementation order (use this as your task list)

1. **Scaffold** the scoped app with `now-sdk create` in scope `x_maf_core`.
2. **Tables & roles.** Create all 7 tables and the 3 roles. Deploy. Verify the schema in the instance.
3. **`MAFMetricCollectorBase` + `MAFDeclarativeCollector` + `MAFCollectorFactory`.** Unit-test the declarative collector against a throwaway Metric Definition you create manually.
4. **`MAFScoringEngine`.** Write pure-function tests for `normalize()` with at least 6 cases covering higher_is_better both true and false.
5. **`MAFAssessmentRunner`.** Implement synchronous version first. Add the background execution wrapper after it works end-to-end.
6. **`MAFAISummaryProvider`** stub implementation only. Leave Now Assist and REST methods as skeletons.
7. **UI Actions** on Assessment Run.
8. **Dashboard & reports.** Create in-instance (captured by the SDK's convert/pull flow) or via XML under `src/server/`.
9. **System properties** + Application navigator modules.
10. **ITSM pack.** Create all seeded records and the three Script Includes. Export as a separate Update Set.
11. **README** with install steps, how to run an assessment, how to install the ITSM pack, and how to author a new pack (reference `docs/pack-authoring.md`).
12. **Smoke test**: install the app on a fresh PDI, install the ITSM pack, create an Assessment Run named "Baseline", pick ITSM, execute, verify all categories populate and the stub AI summary renders.

Commit after each numbered step.

---

## 13. Two gotchas to handle in the code (do not skip)

1. **Cross-scope reads.** Collectors will query `incident`, `task_sla`, `cmdb_ci`, `kb_use` — all global-scope tables. Set the application's access so it can read these tables. Do not attempt any writes to global tables. If a collector needs to `getValue` on a global table field that is restricted, it should catch the exception and return `{ error: ... }` rather than crashing the whole run.

2. **Drill-down URL construction.** `MetricResult.drill_down_query` stores an encoded query that will be opened in the global table's list view. The link formatter (UI macro or list column formatter) must construct `/{drill_down_table}_list.do?sysparm_query={drill_down_query}` rather than relying on the current app scope. Write this as a UI Script Include helper named `MAFDrillDownBuilder`.

---

## 14. Acceptance criteria

The app is considered v1-complete when **all** of the following are true:

- `now-sdk build` and `now-sdk deploy` complete without warnings on a Zurich PDI.
- Installing the ITSM pack Update Set on top of the framework creates 1 Pack, 3 Categories, and 10 Metric Definitions — and does not error.
- Creating an Assessment Run named "Smoke Test", selecting the ITSM pack, and clicking **Execute Run** results in:
  - `state` reaching `complete` within 60 seconds on a PDI with default demo data,
  - 10 Metric Result rows,
  - 3 Category Score rows,
  - 1 AI Summary row with provider `stub` and a non-empty `executive_summary`.
- The Maturity Assessment Overview dashboard renders all three tabs for the run.
- Intentionally breaking one metric (e.g. point a Metric Definition at a nonexistent table) causes exactly that one Metric Result to have `rag_status=error` and a populated `collection_error`, while all other metrics still complete successfully.
- Creating a second pack by copying the ITSM pack's records, renaming to `test_pack`, and installing as a fresh Update Set works without any code changes to the framework.
- README and `docs/pack-authoring.md` exist and describe how to author a new pack end-to-end.

---

## 15. Out of scope for v1 (explicit)

Don't build any of these unless the user explicitly asks:

- Performance Analytics indicators
- Scheduled recurring runs (beyond a disabled stub)
- Custom UI Builder experience or Service Portal page
- Real Now Assist Skill Kit skill implementation
- Real REST LLM provider implementation
- Packs other than ITSM
- Any modifications to global-scope tables
- Role hierarchy beyond the three roles listed
- Multi-language / i18n

---

## 16. Reference material to consult if stuck

- ServiceNow SDK CLI command reference (`now-sdk --help`, `now-sdk create`, `now-sdk build`, `now-sdk deploy`)
- Fluent API docs for table definitions and roles
- `GlideAggregate` API reference for the declarative collector
- `GlideScopedEvaluator` for dynamic Script Include resolution inside a scope

When in doubt, prefer OOTB platform features (reports, dashboards, UI actions) over custom code.
