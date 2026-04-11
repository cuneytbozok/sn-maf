import '@servicenow/sdk/global'
import { Dashboard } from '@servicenow/sdk/core'

/**
 * Platform dashboard shell for PRD §7.3. Chart/list widgets require linked sys_report
 * records; those are authored in-instance (SDK report authoring skipped per project direction).
 * Add reports manually and pin them here, or replace rich-text widgets once reports exist.
 */
export const mafDashboardOverview = Dashboard({
    $id: Now.ID['maf_dashboard_overview'],
    name: 'Maturity Assessment Overview',
    active: true,
    tabs: [
        {
            $id: Now.ID['maf_dash_tab_summary'],
            name: 'Summary',
            widgets: [
                {
                    $id: Now.ID['maf_dash_w_summary'],
                    component: 'rich-text',
                    componentProps: {
                        html: '<p><strong>Summary</strong></p><p>Add Platform reports filtered by <strong>Assessment run</strong> (dashboard filter is enabled on MAF result tables). Category scores roll up from sub-category scores: use bar or single-score on <code>x_maf_core_sub_category_score</code> for drill-down, and <code>x_maf_core_category_score</code> for pack/category totals.</p>',
                    },
                    height: 10,
                    width: 12,
                    position: { x: 0, y: 0 },
                },
            ],
        },
        {
            $id: Now.ID['maf_dash_tab_details'],
            name: 'Details',
            widgets: [
                {
                    $id: Now.ID['maf_dash_w_details'],
                    component: 'rich-text',
                    componentProps: {
                        html: '<p><strong>Details</strong></p><p>Suggested reports: <code>x_maf_core_metric_result</code> grouped by sub-category (via metric definition) or category; list report with RAG column formatting. Sub-category scores on <code>x_maf_core_sub_category_score</code> show metric counts (green/amber/red/error) per sub-area.</p>',
                    },
                    height: 10,
                    width: 12,
                    position: { x: 0, y: 0 },
                },
            ],
        },
        {
            $id: Now.ID['maf_dash_tab_ai'],
            name: 'AI Summary',
            widgets: [
                {
                    $id: Now.ID['maf_dash_w_ai'],
                    component: 'rich-text',
                    componentProps: {
                        html: '<p><strong>AI Summary</strong></p><p>Pin a report on <code>x_maf_core_ai_summary</code> (field <code>executive_summary</code>) or use the Assessment Run form related list. Generated summaries use pack → category → sub-category → metric context; align narrative with sub-category score lists on the run.</p>',
                    },
                    height: 10,
                    width: 12,
                    position: { x: 0, y: 0 },
                },
            ],
        },
    ],
    visibilities: [
        {
            $id: Now.ID['c52c7f3f12ac438a90c0f6554811a0df'],
            experience: '08c73d60537101100834ddeeff7b1287',
        },
    ],
    permissions: [],
})
