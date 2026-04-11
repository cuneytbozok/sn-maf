import '@servicenow/sdk/global'
import { Applicability, UxListMenuConfig, Workspace } from '@servicenow/sdk/core'
import { mafAdmin, mafUser, mafViewer } from '../roles/roles.now'

/**
 * Audience applicability — controls who sees the workspace in the
 * unified navigation and who can access the list views.
 */
export const mafApplicability = Applicability({
    $id: Now.ID['maf_workspace_applicability'],
    name: 'MAF Workspace Audience',
    description: 'Users with any MAF role can access the workspace.',
    roles: [mafAdmin, mafUser, mafViewer],
})

/**
 * List menu config — defines the left-hand nav categories and list views
 * that appear inside the workspace.
 */
export const mafListConfig = UxListMenuConfig({
    $id: Now.ID['maf_workspace_list_config'],
    name: 'MAF Workspace Lists',
    description: 'List navigation for the Maturity Assessment workspace.',
    active: true,
    categories: [
        /* ── Assessment Runs ─────────────────────────────────────────── */
        {
            $id: Now.ID['maf_wsl_cat_runs'],
            title: 'Assessment Runs',
            order: 100,
            lists: [
                {
                    $id: Now.ID['maf_wsl_runs_active'],
                    table: 'x_maf_core_assessment_run',
                    title: 'Active Runs',
                    order: 10,
                    condition: 'state!=complete^state!=failed^EQ',
                    columns: 'number,name,state,packs,started_at,triggered_by',
                    applicabilities: [
                        {
                            $id: Now.ID['maf_wsl_runs_active_app'],
                            active: true,
                            applicability: mafApplicability,
                        },
                    ],
                },
                {
                    $id: Now.ID['maf_wsl_runs_complete'],
                    table: 'x_maf_core_assessment_run',
                    title: 'Completed Runs',
                    order: 20,
                    condition: 'state=complete^EQ',
                    columns: 'number,name,packs,started_at,completed_at,triggered_by',
                    applicabilities: [
                        {
                            $id: Now.ID['maf_wsl_runs_complete_app'],
                            active: true,
                            applicability: mafApplicability,
                        },
                    ],
                },
                {
                    $id: Now.ID['maf_wsl_runs_all'],
                    table: 'x_maf_core_assessment_run',
                    title: 'All Runs',
                    order: 30,
                    condition: '',
                    columns: 'number,name,state,packs,started_at,completed_at,triggered_by',
                    applicabilities: [
                        {
                            $id: Now.ID['maf_wsl_runs_all_app'],
                            active: true,
                            applicability: mafApplicability,
                        },
                    ],
                },
            ],
        },

        /* ── Results & Scores ────────────────────────────────────────── */
        {
            $id: Now.ID['maf_wsl_cat_results'],
            title: 'Results & Scores',
            order: 200,
            lists: [
                {
                    $id: Now.ID['maf_wsl_cat_scores'],
                    table: 'x_maf_core_category_score',
                    title: 'Category Scores',
                    order: 10,
                    condition: '',
                    columns:
                        'assessment_run,category,score,rag_status,metrics_total,metrics_green,metrics_amber,metrics_red,metrics_error',
                    applicabilities: [
                        {
                            $id: Now.ID['maf_wsl_cat_scores_app'],
                            active: true,
                            applicability: mafApplicability,
                        },
                    ],
                },
                {
                    $id: Now.ID['maf_wsl_subcat_scores'],
                    table: 'x_maf_core_sub_category_score',
                    title: 'Sub-category Scores',
                    order: 20,
                    condition: '',
                    columns:
                        'assessment_run,sub_category,score,rag_status,metrics_total,metrics_green,metrics_amber,metrics_red',
                    applicabilities: [
                        {
                            $id: Now.ID['maf_wsl_subcat_scores_app'],
                            active: true,
                            applicability: mafApplicability,
                        },
                    ],
                },
                {
                    $id: Now.ID['maf_wsl_metric_results_red'],
                    table: 'x_maf_core_metric_result',
                    title: 'Red Metrics',
                    order: 30,
                    condition: 'rag_status=red^EQ',
                    columns: 'assessment_run,metric_definition,raw_value,normalized_score,rag_status,collection_error',
                    applicabilities: [
                        {
                            $id: Now.ID['maf_wsl_metric_results_red_app'],
                            active: true,
                            applicability: mafApplicability,
                        },
                    ],
                },
                {
                    $id: Now.ID['maf_wsl_metric_results_amber'],
                    table: 'x_maf_core_metric_result',
                    title: 'Amber Metrics',
                    order: 40,
                    condition: 'rag_status=amber^EQ',
                    columns: 'assessment_run,metric_definition,raw_value,normalized_score,rag_status',
                    applicabilities: [
                        {
                            $id: Now.ID['maf_wsl_metric_results_amber_app'],
                            active: true,
                            applicability: mafApplicability,
                        },
                    ],
                },
                {
                    $id: Now.ID['maf_wsl_metric_results_error'],
                    table: 'x_maf_core_metric_result',
                    title: 'Collection Errors',
                    order: 50,
                    condition: 'collection_errorISNOTEMPTY^EQ',
                    columns: 'assessment_run,metric_definition,collection_error,collected_at',
                    applicabilities: [
                        {
                            $id: Now.ID['maf_wsl_metric_results_error_app'],
                            active: true,
                            applicability: mafApplicability,
                        },
                    ],
                },
                {
                    $id: Now.ID['maf_wsl_metric_results_all'],
                    table: 'x_maf_core_metric_result',
                    title: 'All Metric Results',
                    order: 60,
                    condition: '',
                    columns: 'assessment_run,metric_definition,raw_value,normalized_score,rag_status,collected_at',
                    applicabilities: [
                        {
                            $id: Now.ID['maf_wsl_metric_results_all_app'],
                            active: true,
                            applicability: mafApplicability,
                        },
                    ],
                },
            ],
        },

        /* ── AI Summaries ────────────────────────────────────────────── */
        {
            $id: Now.ID['maf_wsl_cat_ai'],
            title: 'AI Summaries',
            order: 300,
            lists: [
                {
                    $id: Now.ID['maf_wsl_ai_summaries'],
                    table: 'x_maf_core_ai_summary',
                    title: 'All Summaries',
                    order: 10,
                    condition: '',
                    columns: 'assessment_run,provider,generated_at,token_count,error',
                    applicabilities: [
                        {
                            $id: Now.ID['maf_wsl_ai_summaries_app'],
                            active: true,
                            applicability: mafApplicability,
                        },
                    ],
                },
            ],
        },

        /* ── Configuration ───────────────────────────────────────────── */
        {
            $id: Now.ID['maf_wsl_cat_config'],
            title: 'Configuration',
            order: 400,
            lists: [
                {
                    $id: Now.ID['maf_wsl_packs'],
                    table: 'x_maf_core_pack',
                    title: 'Packs',
                    order: 10,
                    condition: '',
                    columns: 'name,label,version,vendor,active,order',
                    applicabilities: [
                        {
                            $id: Now.ID['maf_wsl_packs_app'],
                            active: true,
                            applicability: mafApplicability,
                        },
                    ],
                },
                {
                    $id: Now.ID['maf_wsl_categories'],
                    table: 'x_maf_core_category',
                    title: 'Categories',
                    order: 20,
                    condition: '',
                    columns: 'pack,label,weight,order',
                    applicabilities: [
                        {
                            $id: Now.ID['maf_wsl_categories_app'],
                            active: true,
                            applicability: mafApplicability,
                        },
                    ],
                },
                {
                    $id: Now.ID['maf_wsl_subcategories'],
                    table: 'x_maf_core_sub_category',
                    title: 'Sub-categories',
                    order: 30,
                    condition: '',
                    columns: 'category,label,weight_in_category,order,active',
                    applicabilities: [
                        {
                            $id: Now.ID['maf_wsl_subcategories_app'],
                            active: true,
                            applicability: mafApplicability,
                        },
                    ],
                },
                {
                    $id: Now.ID['maf_wsl_metrics_active'],
                    table: 'x_maf_core_metric_definition',
                    title: 'Metric Definitions',
                    order: 40,
                    condition: 'active=true^EQ',
                    columns:
                        'category,sub_category,label,collector_type,weight_in_category,target_value,higher_is_better,active',
                    applicabilities: [
                        {
                            $id: Now.ID['maf_wsl_metrics_active_app'],
                            active: true,
                            applicability: mafApplicability,
                        },
                    ],
                },
            ],
        },
    ],
})

/**
 * MAF Workspace — Next Experience workspace registered under /now/maf.
 * Provides unified navigation for assessment runs, results, scores,
 * AI summaries, and pack configuration.
 *
 * The landing page must be built in UI Builder after deployment
 * (Create a page at path "home" under this workspace).
 */
export const mafWorkspace = Workspace({
    $id: Now.ID['maf_workspace'],
    title: 'Maturity Assessment',
    path: 'maf',
    landingPath: 'home',
    active: true,
    tables: [
        'x_maf_core_assessment_run',
        'x_maf_core_metric_result',
        'x_maf_core_category_score',
        'x_maf_core_sub_category_score',
        'x_maf_core_ai_summary',
        'x_maf_core_pack',
        'x_maf_core_metric_definition',
        'x_maf_core_category',
        'x_maf_core_sub_category',
    ] as any,
    listConfig: mafListConfig,
    defaultRecordOverrides: {
        sys_ux_registry_m2m_category_5fe3ad3e95b5428d90b3a7a1ca36d868: {
            experience_category: 'afb4e3e173322010f0ca1e666bf6a726',
            order: '500',
            page_registry: 'c9fc3c4cae4e424f9415d7ee83789774',
        },
    },
})
