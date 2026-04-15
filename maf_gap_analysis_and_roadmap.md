# MAF Gap Analysis & Strategic Roadmap

**Date:** 2026-04-14
**Based on:** Current MAF instance metrics (142 definitions) vs. ServiceNow Impact Accelerator documentation (Australia release)
**Purpose:** Identify improvement areas, gaps, and plan the next phases after ITSM + Platform Health packs

---

## 1. Executive Summary

The MAF application currently has **142 metric definitions** (130 active, 12 inactive/retired) across two packs:

| Pack | Categories | Active Metrics | Coverage |
|------|-----------|----------------|----------|
| **ITSM** | 5 categories, 17 sub-categories | ~89 active | Incident, Change, Problem, Request/Catalog, Knowledge, Major Incident, SLA |
| **Platform Health** | 1 category, 9 sub-categories | ~41 active | Performance, Data, Jobs, Business Rules, Update Sets, Footprint, Email/Integration, Security, Logging |

This is a strong foundation. However, analysis against ServiceNow's Impact Accelerator documentation reveals **significant opportunities** to deepen existing coverage, align with Impact's five health pillars, and expand into domains that would make the MAF a compelling alternative to Impact's paid HealthScan + Value Management features.

### Key Findings

1. **Our Platform Health pack partially mirrors Impact's Scan Engine** — but we measure *aggregate health indicators* while Impact measures *per-record code violations*. These are complementary, not competitive. Our approach is strategically better for executive-level conversations.
2. **We have no CMDB/CSDM metrics** — this is the single largest gap. Every Impact Architecture Accelerator starts with CSDM assessment. Partners ask for this first.
3. **We have no Value Management / business outcome metrics** — Impact's ITSM Value Management pack tracks 20+ operational KPIs (MTTR, phone call ratio, standard change %, agent ratios) that we don't measure.
4. **We have no AI/Now Assist readiness metrics** — Impact has a dedicated "Artificial Intelligence Readiness" definition suite. This is a major talking point for stakeholders in 2026.
5. **Our ITSM coverage is process-mature but missing the "modern ITSM" layer** — no Workspace adoption, no Virtual Agent metrics, no Employee Center metrics.

---

## 2. Current State — What We Do Well

### 2.1 Strengths vs. Impact

| Area | MAF Advantage |
|------|--------------|
| **Scoring model** | Impact gives pass/fail per check. MAF gives weighted, normalized scores with RAG thresholds at metric, sub-category, category, and pack levels. This is more nuanced. |
| **ITSM process depth** | Impact's ITSM Value Management tracks ~20 volume/time KPIs. MAF's ITSM pack measures 89 metrics across process compliance, data quality, operational performance, and platform hygiene. Deeper. |
| **Platform health breadth** | Impact's Scan Engine has ~200+ code-level checks. MAF Platform Health has 41 aggregate health indicators. Different angle — MAF tells you "your platform is unhealthy" in a scored conversation; Scan Engine tells developers "fix this specific line of code." |
| **Custom code hygiene** | MAF tracks custom business rules, client scripts, UI policies on incident/change by count and ratio. Impact scans for specific anti-patterns in the code itself. |
| **Catalog maturity** | MAF has 20+ catalog metrics (descriptions, pictures, categories, topics, variable sets, flow adoption, legacy workflow residual). Impact has no equivalent catalog maturity assessment. |
| **OOB compliance** | MAF tracks custom state/priority/urgency/impact/risk/stage values across all ITSM tables. This is unique — Impact doesn't measure OOB choice compliance. |

### 2.2 Areas Where We Match Impact

| Area | Status |
|------|--------|
| Security hygiene (dormant admins, open ACLs, modified ACLs) | Covered — 6 metrics |
| Update set discipline (open sets, no description, conflicts, skipped records) | Covered — 6 metrics |
| Scheduled job health (errors, run-as-admin, stuck jobs, long duration) | Covered — 5 metrics |
| Data volume monitoring (large tables, email, audit, history, attachments, import sets) | Covered — 7 metrics |
| Email & integration health (outbound failures, inbound errors, basic auth, no templates) | Covered — 5 metrics |
| SLA configuration (schedules, pause conditions, attainment) | Covered — 4 metrics |

---

## 3. Gap Analysis — What We're Missing

### 3.1 CRITICAL GAPS (High stakeholder impact, should be in demo plan)

#### Gap 1: CMDB / CSDM Maturity Pack

**Impact alignment:** Impact offers 4 dedicated CMDB/CSDM accelerators: "Introduction to CMDB: Ingestion", "Jumpstart Your CMDB", "Jumpstart Your CSDM: Crawl", "Jumpstart Your CSDM: Foundation", "TuneUp Your CMDB", plus "CSDM Maturity Assessment" and "CSDM Data Modeling" in the Architecture catalog.

**Why this matters:** Every partner-led engagement begins with "what's in your CMDB?" and "are you following CSDM?" We have zero metrics for this.

**Recommended metrics (new pack: `cmdb_csdm`):**

| Sub-category | Metric | What it measures |
|-------------|--------|-----------------|
| CI Completeness | `cmdb_ci_class_coverage` | % of CIs classified beyond base `cmdb_ci` |
| CI Completeness | `cmdb_ci_orphan_rate` | % of CIs with no relationships |
| CI Completeness | `cmdb_ci_staleness_90d` | % of CIs not updated in 90 days |
| CI Completeness | `cmdb_ci_discovery_source_populated` | % of CIs with discovery_source set |
| CI Completeness | `cmdb_ci_operational_status_populated` | % of CIs with operational_status set |
| CSDM Alignment | `csdm_business_service_count` | Count of CMDB Business Services |
| CSDM Alignment | `csdm_technical_service_count` | Count of CMDB Technical Services |
| CSDM Alignment | `csdm_service_offering_count` | Count of Service Offerings |
| CSDM Alignment | `csdm_app_service_linked_to_biz` | % of Application Services linked to Business Services |
| CSDM Alignment | `csdm_ci_to_service_mapping_rate` | % of CIs mapped to at least one service |
| Data Quality | `cmdb_duplicate_ci_rate` | Duplicate detection via name+class+serial |
| Data Quality | `cmdb_ci_no_support_group` | % of CIs with no support group |
| Data Quality | `cmdb_ci_no_owner` | % of CIs with no managed_by/owned_by |
| Relationships | `cmdb_rel_type_diversity` | Count of distinct relationship types in use |
| Relationships | `cmdb_ci_avg_relationships` | Average relationships per CI |
| Discovery & Ingestion | `discovery_schedule_active` | Active discovery schedules count |
| Discovery & Ingestion | `discovery_last_run_age` | Days since last discovery run |
| Discovery & Ingestion | `service_mapping_active` | Whether Service Mapping patterns exist |
| Health Dashboard | `cmdb_health_score_integration` | Whether CMDB Health dashboard is active |

**Estimated effort:** Medium pack (~20 metrics). Mostly declarative collectors on `cmdb_ci`, `cmdb_rel_ci`, `svc_ci_assoc`, `cmdb_ci_service`. Some need the `MAFSchemaIntrospectionCollector` for discovery tables.

---

#### Gap 2: AI & Now Assist Readiness Metrics

**Impact alignment:** Impact has a dedicated "Artificial Intelligence Readiness" Scan Engine suite, "Jumpstart Your ServiceNow AI Journey", "Jumpstart Your AI Search", "Jumpstart Your GenAI", "Jumpstart Your Now Assist in Virtual Agent", "Jumpstart Your Predictive Intelligence", "Jumpstart Your Task Intelligence", and "Adopt AI Governance" + "Foundations of AI Governance" strategy accelerators.

**Why this matters:** Every 2026 stakeholder conversation includes "what are we doing with AI?" Having AI readiness metrics in the MAF demo positions us as forward-looking.

**Recommended metrics (new sub-category in Platform Health or standalone mini-pack):**

| Metric | What it measures |
|--------|-----------------|
| `now_assist_plugin_active` | Whether Now Assist plugins are activated |
| `virtual_agent_active` | Whether Virtual Agent is activated |
| `virtual_agent_topic_count` | Count of active VA conversation topics |
| `virtual_agent_conversations_30d` | VA conversation volume (adoption signal) |
| `predictive_intelligence_active` | Whether Predictive Intelligence is activated |
| `ai_search_active` | Whether AI Search is configured |
| `knowledge_ai_readiness` | % of KB articles with proper structure for AI consumption (short_description + body populated, not draft) |
| `nlu_model_count` | Count of trained NLU models |
| `genai_skill_active_count` | Count of active Now Assist skills |
| `flow_designer_ai_usage` | Whether AI-assisted flow creation is available |

**Estimated effort:** Small pack (~10 metrics). Mix of plugin existence checks (declarative on `sys_plugins`) and count queries.

---

#### Gap 3: Workspace & Modern UX Adoption Metrics

**Impact alignment:** Impact has "Jumpstart Your Service Operations Workspace", multiple "UX:" Architecture Accelerators (Build a Foundation, Catalog Request Experience Review, Design for Employee Center, Optimize Your Portal, Portal Experience Review, Taxonomy Design or Review, Virtual Agent Experience Design), and HealthScan definition HSD0022569 that explicitly checks "Service Operations Workspace ITSM Applications is installed and active."

**Why this matters:** ServiceNow is actively deprecating classic UI. Measuring workspace adoption shows maturity and future-readiness.

**Recommended metrics (expand ITSM pack or new UX pack):**

| Metric | What it measures |
|--------|-----------------|
| `sow_itsm_plugin_active` | Service Operations Workspace ITSM plugin installed |
| `workspace_agent_usage_30d` | % of agents using Workspace vs. classic UI |
| `employee_center_active` | Employee Center plugin installed |
| `employee_center_portal_configured` | EC portal configured with content |
| `mobile_app_active` | Now Mobile configured |
| `next_experience_ui_default` | Whether Next Experience is the default UI |
| `classic_ui_usage_ratio` | Ratio of classic UI page views vs. workspace |
| `unified_navigation_active` | Unified Navigation plugin active |

---

### 3.2 IMPORTANT GAPS (Strong differentiation, next phase)

#### Gap 4: Value Management / Operational KPIs (Impact VM - ITSM Alignment)

Impact's ITSM Value Management Data Collection pack tracks these specific operational KPIs that we do NOT currently measure:

| Impact VM Metric | Our Equivalent | Gap? |
|-----------------|----------------|------|
| Mean Time to Restore - Unplanned Outages (hrs) | `mttr_hours_30d` (incident only) | **Partial** — we don't track outage-level MTTR |
| Average Time to Close an Incident (hrs) | `mttr_hours_30d` | Covered |
| Number of Closed Incidents Originating from Phone Calls | None | **Gap** — channel shift measurement |
| Average Time to Close a Request (hrs) | `ritm_fulfillment_time_hours_30d` | Covered |
| Number of Closed Standard Changes | None | **Gap** — standard change adoption volume |
| Average Time to Close a Change (hrs) | `change_lead_time_hours_normal` | Covered |
| % of Requested Items Fulfilled that were Automated | Partially via `catalog_flow_designer_adoption` | **Partial** |
| % of Changes that are Standard | None directly (we have `change_success_rate`) | **Gap** |
| % of Closed Incidents Originating from Phone Call | None | **Gap** |
| Ratio of Incidents Closed per Tier 1/Tier 2+ Agent | None | **Gap** — agent productivity |
| Number of Unplanned Outages | None | **Gap** |
| Legacy ITSM Systems Annual Run-Rate | None | **Gap** — ROI metric |
| Number of Active Users | None | **Gap** — adoption signal |

**Recommendation:** Add ~8-10 value-oriented metrics to the ITSM pack as a new sub-category "Operational Value Indicators." These bridge the gap between process compliance (what we measure) and business outcomes (what Impact measures).

---

#### Gap 5: Integration & Automation Maturity

**Impact alignment:** "Integration Strategy" Architecture Accelerator, "Jumpstart Your Integration Hub", multiple Scan Engine definitions around REST APIs, import sets, and MID servers.

**Recommended new sub-category or pack:**

| Metric | What it measures |
|--------|-----------------|
| `integration_hub_active` | Integration Hub plugin active |
| `spoke_count` | Number of installed Integration Hub spokes |
| `flow_designer_flow_count` | Total active Flow Designer flows |
| `flow_designer_error_rate_7d` | Already have: `p_log_06_flow_designer_errors_7d` |
| `rest_api_versioning_rate` | % of Scripted REST APIs with versioning enabled |
| `import_set_transform_map_count` | Active transform maps (integration surface area) |
| `mid_server_count` | MID servers deployed |
| `mid_server_cluster_configured` | MID server clustering for HA |
| `oauth_adoption_rate` | % of integrations using OAuth vs. basic auth |
| `api_rate_limiting_configured` | Whether API rate limiting is configured |

---

#### Gap 6: Upgrade & Release Readiness

**Impact alignment:** "Jumpstart Your Upgrade" Technical Accelerator, Scan Engine "Upgradeability" category with specific checks for update set sizes, skipped records, duplicate records, production clone safety, scoped application certification.

**We partially cover this** with update set metrics, but miss:

| Metric | What it measures |
|--------|-----------------|
| `upgrade_skipped_record_count` | Already have: `p_us_06_skipped_records` |
| `update_set_over_500_records` | Impact Scan Engine sn_SE10007 checks this — we don't |
| `update_set_duplicate_records` | Impact sn_SE10050 — we don't track this |
| `production_clone_target_safety` | Impact sn_SE10087 — production not set as clone target |
| `scoped_app_certification_findings` | Scoped app readiness for store publication |
| `family_release_currency` | How many releases behind current |
| `patch_currency` | Days since last patch applied |
| `upgrade_preview_run_recent` | Whether upgrade preview has been run recently |

---

### 3.3 NICE-TO-HAVE GAPS (Future differentiation)

#### Gap 7: Governance & Compliance Maturity

**Impact alignment:** "ServiceNow Governance", "Technical Governance", "Strategy Governance" accelerators. "Center of Excellence and Innovation Maturity Assessment."

| Metric | What it measures |
|--------|-----------------|
| `change_approval_policy_defined` | Whether change approval policies exist |
| `delegation_of_admin_roles` | Admin role holders vs. delegated admin |
| `platform_owner_role_assigned` | Whether a platform owner persona is defined |
| `sdlc_environment_count` | Number of non-prod instances |
| `source_control_adoption` | % of scoped apps using source control (Impact HSD0001106) |
| `atf_test_count` | Automated Test Framework test count |
| `atf_recent_execution` | ATF tests run in last 30 days |

#### Gap 8: Knowledge Management Depth

Our current coverage: `kb_article_freshness`, `kb_article_active_readership_90d`, `incident_kb_attached_at_resolve`. This is thin.

**Impact alignment:** "Jumpstart Your Knowledge Management" accelerator, multiple HealthScan checks for KB health.

| Metric | What it measures |
|--------|-----------------|
| `kb_article_total_published` | Total published articles |
| `kb_article_feedback_enabled` | % of articles with feedback enabled |
| `kb_article_avg_rating` | Average article rating |
| `kb_article_retirement_rate` | Rate of articles being retired (lifecycle management) |
| `kb_knowledge_base_count` | Number of active knowledge bases |
| `kb_article_duplicate_titles` | Potential duplicate articles |
| `kb_search_deflection_rate` | KB search effectiveness |
| `kb_article_workflow_configured` | Whether KB approval workflows are configured |

#### Gap 9: ITOM / Event Management

**Impact alignment:** "Jumpstart Your Event Management", ITOM Value Management data collection pack, "ITOM Maturity Assessment" strategy accelerator.

| Metric | What it measures |
|--------|-----------------|
| `event_management_active` | Event Management plugin installed |
| `alert_management_active` | Alert Management configured |
| `event_to_alert_ratio` | Event compression effectiveness |
| `alert_to_incident_automation` | % of alerts auto-creating incidents |
| `cmdb_health_integration` | CMDB Health dashboard active |

#### Gap 10: HR Service Delivery (HRSD)

**Impact alignment:** "HRSD Maturity Assessment" strategy accelerator, HRSD Value Management data collection pack.

#### Gap 11: Customer Service Management (CSM)

**Impact alignment:** "CSM - Maturity Assessment" strategy accelerator, CSM Value Management data collection pack.

#### Gap 12: Security Operations (SecOps) & IRM

**Impact alignment:** SecOps and IRM Value Management data collection packs, "IRM Maturity Assessment" strategy accelerator.

---

## 4. Improvements to Existing Metrics

### 4.1 ITSM Pack Improvements

| Issue | Detail | Action |
|-------|--------|--------|
| **Missing descriptions** | Several ITSM metrics have empty `description` fields (e.g., `change_backout_completed`, `incident_ci_linked`, `kb_article_freshness`, `change_emergency_ratio`) | Populate all descriptions — critical for demo credibility |
| **Weight rebalancing** | PRD already flags weight drift. Categories with 13-35 metrics need sub-category weight normalization | Complete Phase 0 sub-category refactor before demo |
| **Retired metrics still present** | `resolved_kb_style_close_codes` and `incident_auto_assigned_rate` are inactive but still in export | Clean up or mark clearly as superseded |
| **No trend indicators** | All metrics are point-in-time. Impact shows trend arrows (vs. previous scan) | Add trend comparison to assessment run results (delta from previous run) |
| **No peer benchmarking** | Impact shows "compare to peers" in Tech KPIs. MAF has no benchmark data | Future: collect anonymized benchmarks across partner deployments |

### 4.2 Platform Health Pack Improvements

| Issue | Detail | Action |
|-------|--------|--------|
| **Inactive log metrics** | 5 log metrics are inactive (`p_log_01` through `p_log_05`). Why? | Investigate — if collector issues, fix them; these are valuable |
| **Inactive performance metrics** | `p_perf_04_semaphore_syslog_24h` and `p_perf_05_transaction_log_error_rate` inactive | These map to Impact Scan Engine performance checks — reactivate if possible |
| **Missing Scan Engine parity checks** | Several Impact Scan Engine checks have no MAF equivalent | See Section 5 for alignment matrix |
| **No "proposed fix" equivalent** | Impact Scan Engine offers AI-powered proposed fixes for findings | Out of scope for v1, but note as differentiator for v2 |

### 4.3 Cross-Pack Improvements

| Improvement | Detail |
|------------|--------|
| **Assessment run trend comparison** | Show delta from previous run per metric (Impact does this with "Previous total" comparison) |
| **Executive dashboard enhancement** | Impact has mobile executive experience with simplified view. Consider a simplified "executive summary" dashboard |
| **AI summary improvements** | Current AI summary is per-run. Consider adding per-category summaries and improvement recommendations |
| **Notification on score degradation** | Impact sends monthly digest. MAF could trigger notifications when scores drop below thresholds |
| **Export to PDF/PowerPoint** | Partners need artifacts for customer meetings. Impact generates reports. |

---

## 5. Impact Scan Engine Alignment Matrix

Key Scan Engine definitions and their MAF status:

### Security

| Scan Engine Check | ID | MAF Equivalent | Status |
|-------------------|----|----------------|--------|
| Scripts should not use eval() | sn_SE10023/24 | None | **Gap** |
| High Security Plugin should be enabled | sn_SE10045 | None | **Gap — add** |
| Contextual Security Role Management V2 | sn_SE10046 | None | Nice-to-have |
| Security manager default mode = deny | sn_SE10085 | None | **Gap — add** |
| UI Pages should have read ACL | sn_SE10100 | None | Nice-to-have |
| ACL required on client callable script includes | sn_SE10083 | `p_sec_04_acl_open_no_roles` | Partial |
| Dormant admin ratio | N/A | `p_sec_01_dormant_admin_ratio` | **Covered** |
| Modified OOB ACLs | N/A | `p_sec_05_modified_oob_acl` | **Covered** |

### Performance

| Scan Engine Check | ID | MAF Equivalent | Status |
|-------------------|----|----------------|--------|
| onChange should check isLoading | sn_SE10001 | None | Code-level; out of scope |
| Client scripts should not use GlideRecord | sn_SE10013 | None | Code-level; out of scope |
| Client code should not use sync AJAX | sn_SE10020 | None | Code-level; out of scope |
| Business Rules on Global table | sn_SE10012 | None | **Gap — add count** |
| Client Scripts on Global table | sn_SE10010 | None | **Gap — add count** |
| Import Set Deleter should be active | sn_SE10006 | `p_data_07_import_set_stale_90d` | Partial |
| Slow transactions | Common slow loading forms (HSD0001011) | `p_perf_01_slow_transactions_24h` | **Covered** |
| Long running scheduled jobs | N/A | `p_perf_02_long_running_jobs` | **Covered** |

### Manageability

| Scan Engine Check | ID | MAF Equivalent | Status |
|-------------------|----|----------------|--------|
| Hardcoded sys_ids in scripts | sn_SE10034 | None | Code-level; out of scope |
| Access Controls by role not group | sn_SE10036 | None | **Gap — add count** |
| Reports not run for 3 months | HSD0001378 | None | **Gap — add** |
| Widgets not used in dashboards | HSD0001205 | None | Nice-to-have |
| Duplicate foundation/core data | HSD0001467 | None | Nice-to-have |
| Script Includes with duplicate names | HSD0001398 | None | **Gap — add** |
| Source control adoption for apps | HSD0001106 | None | **Gap — add** |
| JavaScript mode (ES5 vs ES12) | HSD0001107 | None | Nice-to-have |

### Upgradeability

| Scan Engine Check | ID | MAF Equivalent | Status |
|-------------------|----|----------------|--------|
| Update Sets max 500 records | sn_SE10007 | None | **Gap — add** |
| Update Sets duplicate records | sn_SE10050 | None | **Gap — add** |
| Update Sets should have description | sn_SE10051 | `p_us_02_no_description` | **Covered** |
| Skipped upgrade records | sn_SE10102 | `p_us_06_skipped_records` | **Covered** |
| Production as clone target | sn_SE10087 | None | **Gap — add** |
| MID Server unique names | sn_SE10117 | None | Nice-to-have |
| Update Sets should have unique names | sn_SE10262 | None | **Gap — add** |

### User Experience

| Scan Engine Check | ID | MAF Equivalent | Status |
|-------------------|----|----------------|--------|
| Service Operations Workspace installed | HSD0022569 | None | **Gap — add** |
| Long running reports | HSD0024649 | None | **Gap — add** |
| Notifications with inactive recipients | sn_SE10296 | None | **Gap — add** |
| Dirty form support enabled | sn_SE10267 | None | Nice-to-have |
| Max ref dropdown not > 100 | sn_SE10269 | None | Nice-to-have |
| Meta field on catalog items | sn_SE10264 | None | **Gap — add to catalog metrics** |
| Hints on fields | sn_SE10249 | None | Nice-to-have |
| Change conflict detection: blackout | sn_SE10308 | None | **Gap — add** |

---

## 6. Recommended Roadmap

### Phase 1: Demo Readiness (Immediate — before stakeholder demo)

**Goal:** Make existing metrics demo-polished and add highest-impact quick wins.

| # | Action | Effort | Impact |
|---|--------|--------|--------|
| 1 | **Populate all empty metric descriptions** | Low | High — empty descriptions look unfinished |
| 2 | **Complete Phase 0 sub-category refactor** | Medium | High — makes scoring interpretable |
| 3 | **Reactivate or fix inactive log/perf metrics** | Low | Medium — 7 metrics sitting unused |
| 4 | **Add trend delta display** (vs. previous assessment run) | Medium | High — Impact's signature feature |
| 5 | **Add 5-8 high-value quick-win Platform Health metrics** from Scan Engine alignment | Low | High — fills obvious gaps |
|   | - `high_security_plugin_active` | | |
|   | - `security_manager_deny_mode` | | |
|   | - `sow_itsm_plugin_active` (Workspace) | | |
|   | - `update_set_over_500_records` | | |
|   | - `production_clone_target_safe` | | |
|   | - `change_conflict_blackout_enabled` | | |
|   | - `global_business_rules_count` | | |
|   | - `global_client_scripts_count` | | |

### Phase 2: CMDB/CSDM Pack (Next after demo)

**Goal:** Fill the single largest functional gap. Every partner wants this.

| # | Action | Effort |
|---|--------|--------|
| 1 | Design CMDB/CSDM metric definitions (~20 metrics) | Medium |
| 2 | Implement collectors (mostly declarative on cmdb_ci, cmdb_rel_ci) | Medium |
| 3 | Define scoring model with CSDM crawl/walk/run maturity levels | Medium |
| 4 | Build demo dashboard | Low |

### Phase 3: Value & Modern ITSM Enhancement (Quarter after demo)

**Goal:** Bridge the "process compliance" vs. "business value" gap.

| # | Action | Effort |
|---|--------|--------|
| 1 | Add ITSM Value Indicators sub-category (~10 metrics from Impact VM alignment) | Medium |
| 2 | Add AI/Now Assist readiness metrics (~10 metrics) | Low |
| 3 | Add Workspace/Modern UX adoption metrics (~8 metrics) | Low |
| 4 | Add Knowledge Management depth metrics (~8 metrics) | Low |

### Phase 4: Integration & Governance Pack (Following quarter)

**Goal:** Cover the automation and governance maturity dimension.

| # | Action | Effort |
|---|--------|--------|
| 1 | Integration Hub / automation maturity metrics (~10 metrics) | Medium |
| 2 | Governance & compliance metrics (~7 metrics) | Medium |
| 3 | Upgrade/release readiness deepening (~8 metrics) | Low |

### Phase 5: Domain Expansion Packs (Future)

Each of these maps to a dedicated Impact Value Management data collection pack and/or a dedicated Impact Maturity Assessment strategy accelerator:

| Pack | Impact Counterpart | Priority |
|------|-------------------|----------|
| **ITOM** | ITOM Value Management + ITOM Maturity Assessment | High — natural extension of CMDB |
| **HRSD** | HR Value Management + HRSD Maturity Assessment | Medium — if customer has HRSD |
| **CSM** | CSM Value Management + CSM Maturity Assessment | Medium — if customer has CSM |
| **SecOps** | SecOps Value Management | Medium |
| **SPM** | SPM Value Management + PPM Maturity Assessment | Low |
| **IRM** | IRM Value Management + IRM Maturity Assessment | Low |
| **SAM/HAM** | SAM/HAM Value Management + SAM Maturity Assessment | Low |

---

## 7. Competitive Positioning vs. Impact

### What Impact Has That We Don't (and shouldn't try to replicate)

| Impact Feature | Why we skip it |
|---------------|---------------|
| **Per-record code-level scanning** (Scan Engine) | Different tool, different purpose. Scan Engine is a developer tool; MAF is an assessment tool. They complement each other. |
| **Real-time prevention** (block saves) | Requires deep platform integration. Not appropriate for a scoped app assessment tool. |
| **Proposed AI fixes for findings** | Requires Now Assist integration at the code level. Future consideration. |
| **Instance Observer** (real-time performance monitoring) | Operational monitoring, not assessment. Different cadence entirely. |
| **Learning credits & training recommendations** | Commercial offering, not a technical tool. |
| **Impact Squad human expertise** | Service, not software. |

### Where MAF Can Differentiate

| MAF Differentiator | Detail |
|-------------------|--------|
| **Free / included with partner engagement** | Impact is a paid subscription ($$$). MAF ships with partner services. |
| **Customizable scoring model** | Impact is take-it-or-leave-it. MAF weights and thresholds are fully configurable per customer. |
| **Cross-domain single score** | Impact measures domains separately. MAF produces one maturity score across ITSM + Platform Health + CMDB + future packs. |
| **Assessment-as-artifact** | Each MAF run is a point-in-time document with AI summary. Perfect for quarterly business reviews. |
| **OOB compliance measurement** | Impact doesn't measure whether customers are using OOB states, priorities, etc. MAF does. |
| **Catalog maturity depth** | 20+ catalog metrics is unmatched. |
| **Partner white-label ready** | MAF can be branded and customized. Impact cannot. |

---

## 8. Demo Talking Points for Stakeholders

When presenting MAF to stakeholders, emphasize:

1. **"We measure what Impact charges for — and more."** MAF's 142 metrics across ITSM and Platform Health cover the same ground as Impact's HealthScan + ITSM Value Management, plus deeper catalog maturity and OOB compliance that Impact doesn't touch.

2. **"One score, one conversation."** Unlike Impact's disconnected health checks, MAF gives you a single weighted maturity score you can track over time and present to executives.

3. **"Extensible by design."** CMDB, ITOM, HRSD, CSM packs are on the roadmap. Each uses the same framework — no new apps, no new schemas.

4. **"AI-powered insights."** Every assessment run generates an executive summary. As we add more packs, the AI summary becomes a cross-domain health narrative.

5. **"Impact compatibility."** MAF doesn't compete with Impact — it complements it. Customers with Impact get deeper insights from MAF's assessment model. Customers without Impact get core health measurement they'd otherwise pay for.

---

## 9. Immediate Next Steps

| # | Action | Owner | Target |
|---|--------|-------|--------|
| 1 | Populate all empty metric descriptions in ITSM pack | Dev | Before demo |
| 2 | Complete sub-category scoring refactor (Phase 0) | Dev | Before demo |
| 3 | Add 8 quick-win Platform Health metrics (Section 6, Phase 1 #5) | Dev | Before demo |
| 4 | Reactivate/fix 7 inactive metrics | Dev | Before demo |
| 5 | Add trend delta to assessment run display | Dev | Before demo |
| 6 | Design CMDB/CSDM pack metric specifications | Dev + Architect | Sprint after demo |
| 7 | Draft AI readiness metrics specification | Dev | Sprint after demo |
| 8 | Create partner-facing one-pager comparing MAF vs. Impact | Product | Before demo |

---

## Appendix A: Full Metric Inventory Summary

### ITSM Pack (89 active metrics across 5 categories)

| Category | Sub-categories | Active Metrics | Key Areas |
|----------|---------------|----------------|-----------|
| Data Quality | CI linkage, field quality, short description, close notes, categorization | 13 | Incident/Change/Problem data completeness |
| Operational Performance | MTTR, FCR, reopen rate, backlog, fulfillment time, lead time | 15 | Time-based KPIs and throughput |
| Process Compliance | SLA attainment, PIR, emergency ratio, reassignment, KB attachment, schedule adherence | 14 | ITIL process adherence |
| Automation & Self-Service | Flow adoption, AWA, assignment rules, self-service ratio, subflow usage | 10 | Modern automation adoption |
| Platform Hygiene | Catalog metrics, custom code, OOB compliance, notifications, SLA config, taxonomy | 35 | Configuration quality and OOB alignment |

### Platform Health Pack (41 active metrics across 9 sub-categories)

| Sub-category | Active Metrics | Key Areas |
|-------------|----------------|-----------|
| Instance Performance | 4 | Slow transactions, long running jobs, stuck jobs, MID server health |
| Data Volume & Retention | 7 | Large tables, email, audit, history, attachments, import sets, archive rules |
| Scheduled Job Health | 5 | Job errors, run-as-admin, no description, past next_action, long duration |
| Business Rule Sanity | 5 | Before BR HTTP calls, duplicate order, async count, undocumented, modified OOB |
| Update Set Discipline | 6 | Open sets, no description, empty sets, conflicts, outside batch, skipped records |
| Plugin & App Footprint | 7 | Customer apps, global metadata, inactive plugins, store apps, custom tables/pages/properties |
| Email & Integration Health | 5 | Outbound failures, inbound errors, basic auth, REST errors, no-template notifications |
| Security Hygiene | 6 | Dormant admins, no-expiration admin roles, global ACL on scoped tables, open ACLs, modified ACLs, inactive user roles |
| Logging & Error Rates | 1 active (5 inactive) | Flow Designer errors (others inactive — investigate) |

### Inactive Metrics (12 total)

| Metric | Reason |
|--------|--------|
| `resolved_kb_style_close_codes` | Superseded by `incident_kb_attached_at_resolve` |
| `incident_auto_assigned_rate` | Duplicate of `assignment_group_at_resolve` |
| `p_ei_04_rest_outbound_errors_24h` | Inactive — needs investigation |
| `p_log_01` through `p_log_05` | 5 log metrics inactive — needs investigation |
| `p_perf_04_semaphore_syslog_24h` | Inactive — needs investigation |
| `p_perf_05_transaction_log_error_rate` | Inactive — needs investigation |

---

## Appendix B: Impact Value Management ITSM Metrics (Full List)

For reference — these are all the KPIs in Impact's ITSM Value Management Data Collection pack:

| # | Metric | Type | Our Coverage |
|---|--------|------|-------------|
| 1 | Mean Time to Restore - Unplanned Outages (hrs) | Automated | Partial (incident MTTR only) |
| 2 | Average Time to Close an Incident (hrs) | Automated | Yes |
| 3 | Number of Closed Incidents Originating from Phone Calls | Automated | **No** |
| 4 | Average Time to Close a Request (hrs) | Automated | Yes |
| 5 | Number of Closed Standard Changes | Automated | **No** |
| 6 | Average Time to Close a Change (hrs) | Automated | Yes |
| 7 | Requested Items Closed This Month | Automated | **No** (we have rates, not counts) |
| 8 | Requests Fulfilled This Month | Automated | **No** |
| 9 | Incidents Closed This Month (total) | Automated | **No** |
| 10 | L1 Incidents Closed This Month | Automated | **No** |
| 11 | L2+ Incidents Closed This Month | Automated | **No** |
| 12 | Changes Closed This Month | Automated | **No** |
| 13 | Tier 1 Agents count | Automated | **No** |
| 14 | Tier 2+ Agents count | Automated | **No** |
| 15 | Number of Active Users | Automated | **No** |
| 16 | Automated Requested Items Closed This Month | Automated | **No** |
| 17 | Number of Unplanned Outages | Automated | **No** |
| 18 | Legacy ITSM Systems Annual Run-Rate | Manual | **No** (ROI metric) |
| 19 | Ratio of Incidents Closed per Tier 2+ Agent This Month | Formula | **No** |
| 20 | % of Requested Items Fulfilled that were Automated | Formula | Partial |
| 21 | % of Changes that are Standard | Formula | **No** |
| 22 | % of Closed Incidents Originating from Phone Call | Formula | **No** |
| 23 | Ratio of Incidents Closed per Tier 1 Agent This Month | Formula | **No** |

**Note:** Impact's metrics are volume/time-based (monthly counts, averages). MAF's are maturity-based (percentages, rates, compliance). These are fundamentally different perspectives — both are valuable. The gap is that MAF doesn't offer the volume/time view at all. Adding a "Value Indicators" sub-category would close this.
