import '@servicenow/sdk/global'
import { ApplicationMenu, Property, Record, UiAction, UiPolicy } from '@servicenow/sdk/core'
import { Form } from '../../../node_modules/@servicenow/sdk-core/src/ui/Form'
import { mafAdmin, mafUser, mafViewer } from '../roles/roles.now'

export const mafAppMenu = ApplicationMenu({
    $id: Now.ID['maf_app_menu'],
    title: 'Maturity Assessment',
    description: 'Maturity Assessment Framework — packs, runs, and scores.',
    hint: 'MAF',
    roles: [mafAdmin, mafUser, mafViewer],
    active: true,
    order: 1000,
    category: '',
})

Record({
    $id: Now.ID['maf_mod_assessment_runs'],
    table: 'sys_app_module',
    data: {
        application: mafAppMenu,
        title: 'Assessment Runs',
        active: true,
        order: 100,
        link_type: 'LIST',
        name: 'x_maf_core_assessment_run',
        override_menu_roles: false,
        require_confirmation: false,
        sys_domain: 'global',
        sys_domain_path: '/',
        uncancelable: false,
    },
})

Record({
    $id: Now.ID['maf_mod_new_run'],
    table: 'sys_app_module',
    data: {
        application: mafAppMenu,
        title: 'New Assessment Run',
        active: true,
        order: 110,
        link_type: 'NEW',
        name: 'x_maf_core_assessment_run',
        override_menu_roles: false,
        require_confirmation: false,
        sys_domain: 'global',
        sys_domain_path: '/',
        uncancelable: false,
    },
})

Record({
    $id: Now.ID['maf_mod_packs'],
    table: 'sys_app_module',
    data: {
        application: mafAppMenu,
        title: 'Packs',
        active: true,
        order: 200,
        link_type: 'LIST',
        name: 'x_maf_core_pack',
        override_menu_roles: false,
        require_confirmation: false,
        sys_domain: 'global',
        sys_domain_path: '/',
        uncancelable: false,
    },
})

Record({
    $id: Now.ID['maf_mod_metric_definitions'],
    table: 'sys_app_module',
    data: {
        application: mafAppMenu,
        title: 'Metric Definitions',
        active: true,
        order: 300,
        link_type: 'LIST',
        name: 'x_maf_core_metric_definition',
        override_menu_roles: false,
        require_confirmation: false,
        sys_domain: 'global',
        sys_domain_path: '/',
        uncancelable: false,
    },
})

Record({
    $id: Now.ID['maf_mod_sub_categories'],
    table: 'sys_app_module',
    data: {
        application: mafAppMenu,
        title: 'Sub-categories',
        active: true,
        order: 350,
        link_type: 'LIST',
        name: 'x_maf_core_sub_category',
        override_menu_roles: false,
        require_confirmation: false,
        sys_domain: 'global',
        sys_domain_path: '/',
        uncancelable: false,
    },
})

Record({
    $id: Now.ID['maf_mod_category_scores'],
    table: 'sys_app_module',
    data: {
        application: mafAppMenu,
        title: 'Category Scores',
        active: true,
        order: 400,
        link_type: 'LIST',
        name: 'x_maf_core_category_score',
        override_menu_roles: false,
        require_confirmation: false,
        sys_domain: 'global',
        sys_domain_path: '/',
        uncancelable: false,
    },
})

Record({
    $id: Now.ID['maf_mod_sub_category_scores'],
    table: 'sys_app_module',
    data: {
        application: mafAppMenu,
        title: 'Sub-category Scores',
        active: true,
        order: 450,
        link_type: 'LIST',
        name: 'x_maf_core_sub_category_score',
        override_menu_roles: false,
        require_confirmation: false,
        sys_domain: 'global',
        sys_domain_path: '/',
        uncancelable: false,
    },
})

Record({
    $id: Now.ID['maf_mod_metric_results'],
    table: 'sys_app_module',
    data: {
        application: mafAppMenu,
        title: 'Metric Results',
        active: true,
        order: 500,
        link_type: 'LIST',
        name: 'x_maf_core_metric_result',
        override_menu_roles: false,
        require_confirmation: false,
        sys_domain: 'global',
        sys_domain_path: '/',
        uncancelable: false,
    },
})

Record({
    $id: Now.ID['maf_mod_dashboards'],
    table: 'sys_app_module',
    data: {
        application: mafAppMenu,
        title: 'Dashboards',
        active: true,
        order: 600,
        link_type: 'LIST',
        name: 'par_dashboard',
        query: 'sysparm_query=name=Maturity Assessment Overview',
        override_menu_roles: false,
        require_confirmation: false,
        sys_domain: 'global',
        sys_domain_path: '/',
        uncancelable: false,
    },
})

Record({
    $id: Now.ID['maf_mod_properties'],
    table: 'sys_app_module',
    data: {
        application: mafAppMenu,
        title: 'Properties',
        active: true,
        order: 700,
        link_type: 'FILTER',
        name: 'sys_properties',
        query: 'sysparm_query=nameSTARTSWITHx_maf_core^ORDERBYname',
        override_menu_roles: false,
        require_confirmation: false,
        sys_domain: 'global',
        sys_domain_path: '/',
        uncancelable: false,
    },
})

UiAction({
    $id: Now.ID['maf_ui_action_execute_run'],
    table: 'x_maf_core_assessment_run',
    name: 'Execute Run',
    actionName: 'maf_execute_run',
    active: true,
    showUpdate: true,
    showInsert: true,
    order: 100,
    condition: "current.state == 'draft'",
    roles: [mafAdmin, mafUser],
    hint: 'Collect metrics, score categories, and generate AI summary in the background.',
    form: { showButton: true, style: 'primary' },
    script: `var runner = new MAFAssessmentRunner();
var ok = runner.run(current.getUniqueValue());
if (ok) {
  gs.addInfoMessage('Run started');
} else {
  gs.addErrorMessage('Could not start the assessment run.');
}
action.setRedirectURL(current);`,
    messages: [],
})

UiAction({
    $id: Now.ID['maf_ui_action_generate_ai_summary'],
    table: 'x_maf_core_assessment_run',
    name: 'Generate AI Summary',
    actionName: 'maf_generate_ai_summary',
    active: true,
    showUpdate: true,
    showInsert: false,
    order: 150,
    condition: "current.state != 'draft' && current.state != 'running'",
    roles: [mafAdmin, mafUser],
    hint: 'Build or refresh the MAF AI Summary (metrics JSON + prompt) on the related MAF AI Summary record.',
    form: { showButton: true, style: 'unstyled' },
    script: `gs.include('MAFAISummaryProvider');
var ai = new MAFAISummaryProvider();
ai.generate(current.getUniqueValue());
gs.addInfoMessage('AI summary generated. Review the MAF AI Summary related list on this run.');
var st = current.getValue('state');
if (st == 'scored' || st == 'summarized') {
  current.setValue('state', 'complete');
  if (!current.getValue('completed_at')) {
    current.setValue('completed_at', new GlideDateTime());
  }
  current.update();
}
action.setRedirectURL(current);`,
    messages: [],
})

UiAction({
    $id: Now.ID['maf_ui_action_view_dashboard'],
    table: 'x_maf_core_assessment_run',
    name: 'View Dashboard',
    actionName: 'maf_view_dashboard',
    active: true,
    showUpdate: true,
    order: 200,
    condition: "current.state == 'complete' || current.state == 'summarized' || current.state == 'scored'",
    roles: [mafAdmin, mafUser, mafViewer],
    hint: 'Open the Maturity Assessment Overview dashboard.',
    form: { showButton: true, style: 'unstyled' },
    script: `var d = new GlideRecord('par_dashboard');
d.addQuery('name', 'Maturity Assessment Overview');
d.query();
if (d.next()) {
  action.setRedirectURL('par_dashboard.do?sys_id=' + d.getUniqueValue());
} else {
  gs.addErrorMessage('Maturity Assessment Overview dashboard not found. Redeploy the MAF application or open Dashboards from the application menu.');
  action.setRedirectURL(current);
}`,
    messages: [],
    showInsert: true,
})

Form({
    $id: Now.ID['maf_form_assessment_run'],
    table: 'x_maf_core_assessment_run',
    view: 'Default view',
    sections: [
        {
            caption: 'Assessment run',
            content: [
                {
                    layout: 'two-column',
                    leftElements: [
                        { type: 'table_field', field: 'number' },
                        { type: 'table_field', field: 'name' },
                        { type: 'table_field', field: 'state' },
                        { type: 'table_field', field: 'packs' },
                    ],
                    rightElements: [
                        { type: 'table_field', field: 'started_at' },
                        { type: 'table_field', field: 'completed_at' },
                        { type: 'table_field', field: 'triggered_by' },
                    ],
                },
                {
                    layout: 'one-column',
                    elements: [
                        { type: 'table_field', field: 'error_message' },
                        { type: 'table_field', field: 'overall_notes' },
                    ],
                },
            ],
        },
        {
            caption: 'Results',
            content: [
                {
                    layout: 'one-column',
                    elements: [
                        { type: 'list', listType: '12M', listRef: 'x_maf_core_ai_summary.assessment_run' },
                        { type: 'list', listType: '12M', listRef: 'x_maf_core_category_score.assessment_run' },
                        { type: 'list', listType: '12M', listRef: 'x_maf_core_sub_category_score.assessment_run' },
                        { type: 'list', listType: '12M', listRef: 'x_maf_core_metric_result.assessment_run' },
                    ],
                },
            ],
        },
    ],
} as any)

Form({
    $id: Now.ID['maf_form_metric_definition'],
    table: 'x_maf_core_metric_definition',
    view: 'Default view',
    sections: [
        {
            caption: 'Definition',
            content: [
                {
                    layout: 'two-column',
                    leftElements: [
                        { type: 'table_field', field: 'category' },
                        { type: 'table_field', field: 'sub_category' },
                        { type: 'table_field', field: 'name' },
                        { type: 'table_field', field: 'label' },
                        { type: 'table_field', field: 'description' },
                        { type: 'table_field', field: 'collector_type' },
                    ],
                    rightElements: [
                        { type: 'table_field', field: 'active' },
                        { type: 'table_field', field: 'unit' },
                        { type: 'table_field', field: 'weight_in_category' },
                        { type: 'table_field', field: 'higher_is_better' },
                    ],
                },
            ],
        },
        {
            caption: 'Declarative collector',
            content: [
                {
                    layout: 'one-column',
                    elements: [
                        { type: 'table_field', field: 'source_table' },
                        { type: 'table_field', field: 'filter_condition' },
                        { type: 'table_field', field: 'aggregation' },
                        { type: 'table_field', field: 'aggregation_field' },
                        { type: 'table_field', field: 'denominator_filter' },
                    ],
                },
            ],
        },
        {
            caption: 'Script collector',
            content: [
                {
                    layout: 'one-column',
                    elements: [
                        { type: 'table_field', field: 'script_include' },
                        { type: 'table_field', field: 'script_params' },
                    ],
                },
            ],
        },
        {
            caption: 'Targets and thresholds',
            content: [
                {
                    layout: 'one-column',
                    elements: [
                        { type: 'table_field', field: 'target_value' },
                        { type: 'table_field', field: 'threshold_red' },
                        { type: 'table_field', field: 'threshold_amber' },
                    ],
                },
            ],
        },
    ],
} as any)

UiPolicy({
    $id: Now.ID['maf_ui_policy_metric_declarative'],
    table: 'x_maf_core_metric_definition',
    shortDescription: 'Show declarative collector fields when collector type is declarative',
    active: true,
    onLoad: true,
    global: true,
    reverseIfFalse: true,
    order: 100,
    conditions: "current.collector_type == 'declarative'",
    actions: [
        { field: 'source_table', visible: true },
        { field: 'filter_condition', visible: true },
        { field: 'aggregation', visible: true },
        { field: 'aggregation_field', visible: true },
        { field: 'denominator_filter', visible: true },
    ],
})

UiPolicy({
    $id: Now.ID['maf_ui_policy_metric_script'],
    table: 'x_maf_core_metric_definition',
    shortDescription: 'Show script include fields when collector type is script include',
    active: true,
    onLoad: true,
    global: true,
    reverseIfFalse: true,
    order: 200,
    conditions: "current.collector_type == 'script_include'",
    actions: [
        { field: 'script_include', visible: true },
        { field: 'script_params', visible: true },
    ],
})

Property({
    $id: Now.ID['maf_prop_ai_provider'],
    name: 'x_maf_core.ai_provider',
    type: 'choicelist',
    value: 'rest_llm',
    description: 'AI provider for executive summaries (stub, Now Assist, REST LLM).',
    choices: ['stub', 'now_assist', 'rest_llm'],
    roles: {
        read: [mafAdmin, mafUser, mafViewer],
        write: [mafAdmin],
    },
})

Property({
    $id: Now.ID['maf_prop_score_threshold_green'],
    name: 'x_maf_core.score_threshold_green',
    type: 'integer',
    value: '75',
    description: 'Category score at or above this threshold is green (PRD §8).',
    roles: {
        read: [mafAdmin, mafUser, mafViewer],
        write: [mafAdmin],
    },
})

Property({
    $id: Now.ID['maf_prop_score_threshold_amber'],
    name: 'x_maf_core.score_threshold_amber',
    type: 'integer',
    value: '50',
    description: 'Category score at or above this threshold is amber.',
    roles: {
        read: [mafAdmin, mafUser, mafViewer],
        write: [mafAdmin],
    },
})

Property({
    $id: Now.ID['maf_prop_max_concurrent_runs'],
    name: 'x_maf_core.max_concurrent_runs',
    type: 'integer',
    value: '1',
    description: 'Maximum assessment runs in Running state at once.',
    roles: {
        read: [mafAdmin, mafUser, mafViewer],
        write: [mafAdmin],
    },
})

Property({
    $id: Now.ID['maf_prop_rest_llm_message'],
    name: 'x_maf_core.rest_llm_message',
    type: 'string',
    value: 'x_maf_core_llm_generate',
    description: 'REST message record name for REST LLM provider.',
    roles: {
        read: [mafAdmin, mafUser, mafViewer],
        write: [mafAdmin],
    },
})

Property({
    $id: Now.ID['maf_prop_rest_llm_chat_url'],
    name: 'x_maf_core.rest_llm_chat_url',
    type: 'string',
    value: 'https://api.openai.com/v1/chat/completions',
    description:
        'OpenAI-compatible chat completions URL (e.g. https://api.openai.com/v1/chat/completions). When set with rest_llm_api_key, REST LLM provider POSTs JSON built from the assessment payload and prompts.',
    roles: {
        read: [mafAdmin, mafUser, mafViewer],
        write: [mafAdmin],
    },
})

Property({
    $id: Now.ID['maf_prop_rest_llm_api_key'],
    name: 'x_maf_core.rest_llm_api_key',
    type: 'password',
    value: `{{gpaes}}ju52WA3A0jweeCHi+CvmZ1lE6MGn3cnT5P3HKU4UvaXpC6xJ6Kvqdp0UtAC2f1wMRJZL8kA4IB4G&#13;
9yDgj2uaQu7aLmH1SR3wR99tZg9a3Z5fcD0UjRhfCKA9zSJaODuDT5BQ12vkO9eNlmIym1+FPWLq&#13;
bha66Qe57+fPv9cpm1F7dHxumyBwV2su+2wHUYulH7pLpmrhp3/LDeKqaEppEdaLOFBawV/CryzL&#13;
DN7/fNM=`,
    description:
        'Bearer token for rest_llm_chat_url (Authorization header). Leave empty for local endpoints that do not require auth.',
    roles: {
        read: [mafAdmin],
        write: [mafAdmin],
    },
})

Property({
    $id: Now.ID['maf_prop_rest_llm_model'],
    name: 'x_maf_core.rest_llm_model',
    type: 'string',
    value: 'gpt-5.4',
    description: 'Model name sent in the chat completions request body (OpenAI-compatible APIs).',
    roles: {
        read: [mafAdmin, mafUser, mafViewer],
        write: [mafAdmin],
    },
})
