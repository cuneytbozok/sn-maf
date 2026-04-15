import '@servicenow/sdk/global'
import { Applicability, Record, UxListMenuConfig } from '@servicenow/sdk/core'

/** Instance sys_ux_applicability (workspace list access). */
export const mafApplicability = Applicability({
    $id: Now.ID['b8b0e343cdc449368ddd9e2b64edfe6c'],
    name: 'MAF Workspace Audience',
    description: 'Users with any MAF role can access the workspace.',
    roles: ['0dc9f9c3d1a743abb96c5172e3a81c59', '420d6e789b624d6e8511f6f9e9c39fe0', '3fcbb8e3433344d58222cd00f836d190'],
})

/** Instance sys_ux_list_menu_config — list navigation inside the workspace. */
export const mafListConfig = UxListMenuConfig({
    $id: Now.ID['8fe9ba07e61f4d5a8abb5bb0a99a38b1'],
    name: 'MAF Workspace Lists',
    description: 'List navigation for the Maturity Assessment workspace.',
    categories: [
        {
            $id: Now.ID['460aad3f011246e181f68c74479f55e6'],
            title: 'Configuration',
            order: 400,
            lists: [
                {
                    $id: Now.ID['19854d40e72e480cab2b1f8f7d724463'],
                    applicabilities: [
                        {
                            $id: Now.ID['aa0b0feb4e744a2f871e688b85f81bff'],
                            applicability: 'b8b0e343cdc449368ddd9e2b64edfe6c',
                        },
                    ],
                    columns: 'category,label,weight_in_category,order,active',
                    condition: '',
                    order: 30,
                    table: 'x_maf_core_sub_category',
                    title: 'Sub-categories',
                },
                {
                    $id: Now.ID['3c1b7c34e6234475b19e6350ea37dcc8'],
                    applicabilities: [
                        {
                            $id: Now.ID['db2b15a6ca8f473fae303a6df063d956'],
                            applicability: 'b8b0e343cdc449368ddd9e2b64edfe6c',
                        },
                    ],
                    columns: 'pack,label,weight,order',
                    condition: '',
                    order: 20,
                    table: 'x_maf_core_category',
                    title: 'Categories',
                },
                {
                    $id: Now.ID['c84d277d0cdc4806b56b53374d91956b'],
                    applicabilities: [
                        {
                            $id: Now.ID['c43f67b4e9294c63a80db29d43e96a33'],
                            applicability: 'b8b0e343cdc449368ddd9e2b64edfe6c',
                        },
                    ],
                    columns: 'name,label,version,vendor,active,order',
                    condition: '',
                    order: 10,
                    table: 'x_maf_core_pack',
                    title: 'Packs',
                },
                {
                    $id: Now.ID['ef4cb6384aa1419a9335316e864ba118'],
                    applicabilities: [
                        {
                            $id: Now.ID['5c9acc82e4a04b1894efbe390a37b1c3'],
                            applicability: 'b8b0e343cdc449368ddd9e2b64edfe6c',
                        },
                    ],
                    columns:
                        'category,sub_category,label,collector_type,weight_in_category,target_value,higher_is_better,active',
                    condition: 'active=true^EQ',
                    order: 40,
                    table: 'x_maf_core_metric_definition',
                    title: 'Metric Definitions',
                },
            ],
        },
        {
            $id: Now.ID['7c72d25db29d4309ae62a40abe12016c'],
            title: 'Assessment Runs',
            lists: [
                {
                    $id: Now.ID['52e7c071299c40ba8a1528f7c284fdf5'],
                    applicabilities: [
                        {
                            $id: Now.ID['8a4b201af14045828007b5fa7f53b87f'],
                            applicability: 'b8b0e343cdc449368ddd9e2b64edfe6c',
                        },
                    ],
                    columns: 'number,name,state,packs,started_at,completed_at,triggered_by',
                    condition: '',
                    order: 30,
                    table: 'x_maf_core_assessment_run',
                    title: 'All Runs',
                },
                {
                    $id: Now.ID['72382ce55b6c4093935c54c6546c19fe'],
                    applicabilities: [
                        {
                            $id: Now.ID['9a4faf1d897445a3974d6e6e86dffadb'],
                            applicability: 'b8b0e343cdc449368ddd9e2b64edfe6c',
                        },
                    ],
                    columns: 'number,name,packs,started_at,completed_at,triggered_by',
                    condition: 'state=complete^EQ',
                    order: 20,
                    table: 'x_maf_core_assessment_run',
                    title: 'Completed Runs',
                },
                {
                    $id: Now.ID['9c177433503740379728c1f629044329'],
                    applicabilities: [
                        {
                            $id: Now.ID['c6eb4903d41e41bd9b2343bfb06f888d'],
                            applicability: 'b8b0e343cdc449368ddd9e2b64edfe6c',
                        },
                    ],
                    columns: 'number,name,state,packs,started_at,triggered_by',
                    condition: 'state!=complete^state!=failed^EQ',
                    order: 10,
                    table: 'x_maf_core_assessment_run',
                    title: 'Active Runs',
                },
            ],
        },
        {
            $id: Now.ID['f2f1fff1c6164f8094d02ff8c3d7555c'],
            title: 'Results & Scores',
            order: 200,
            lists: [
                {
                    $id: Now.ID['2c75a3723e044ce2a639dd134e9273d7'],
                    applicabilities: [
                        {
                            $id: Now.ID['566f1bd6c84f41c6a20639e68e483032'],
                            applicability: 'b8b0e343cdc449368ddd9e2b64edfe6c',
                        },
                    ],
                    columns:
                        'assessment_run,sub_category,score,rag_status,metrics_total,metrics_green,metrics_amber,metrics_red',
                    condition: '',
                    order: 20,
                    table: 'x_maf_core_sub_category_score',
                    title: 'Sub-category Scores',
                },
                {
                    $id: Now.ID['2d6327496e15449d973c219d88fd8031'],
                    applicabilities: [
                        {
                            $id: Now.ID['e121dd9a35ab4711861aa46e72fdb53e'],
                            applicability: 'b8b0e343cdc449368ddd9e2b64edfe6c',
                        },
                    ],
                    columns: 'assessment_run,metric_definition,collection_error,collected_at',
                    condition: 'collection_errorISNOTEMPTY^EQ',
                    order: 50,
                    table: 'x_maf_core_metric_result',
                    title: 'Collection Errors',
                },
                {
                    $id: Now.ID['2f9272dbcbe24d5d8fed81c022a756e9'],
                    applicabilities: [
                        {
                            $id: Now.ID['11928a7220894d7db24696b9e764cded'],
                            applicability: 'b8b0e343cdc449368ddd9e2b64edfe6c',
                        },
                    ],
                    columns: 'assessment_run,metric_definition,raw_value,normalized_score,rag_status,collection_error',
                    condition: 'rag_status=red^EQ',
                    order: 30,
                    table: 'x_maf_core_metric_result',
                    title: 'Red Metrics',
                },
                {
                    $id: Now.ID['68ea6788452845ca9004914ef9229db8'],
                    applicabilities: [
                        {
                            $id: Now.ID['ebbd9ad93f2f4cf6adfcc62e4a3fc08d'],
                            applicability: 'b8b0e343cdc449368ddd9e2b64edfe6c',
                        },
                    ],
                    columns:
                        'assessment_run,category,score,rag_status,metrics_total,metrics_green,metrics_amber,metrics_red,metrics_error',
                    condition: '',
                    order: 10,
                    table: 'x_maf_core_category_score',
                    title: 'Category Scores',
                },
                {
                    $id: Now.ID['912b640577da40ffb226be6514d988dd'],
                    applicabilities: [
                        {
                            $id: Now.ID['b8fbe7232af143bd9330c3833f5f0b7b'],
                            applicability: 'b8b0e343cdc449368ddd9e2b64edfe6c',
                        },
                    ],
                    columns: 'assessment_run,metric_definition,raw_value,normalized_score,rag_status,collected_at',
                    condition: '',
                    order: 60,
                    table: 'x_maf_core_metric_result',
                    title: 'All Metric Results',
                },
                {
                    $id: Now.ID['c042289efc5f400db8069e466e54760d'],
                    applicabilities: [
                        {
                            $id: Now.ID['ea28a9f35a2841dca0ad902886ea40fc'],
                            applicability: 'b8b0e343cdc449368ddd9e2b64edfe6c',
                        },
                    ],
                    columns: 'assessment_run,metric_definition,raw_value,normalized_score,rag_status',
                    condition: 'rag_status=amber^EQ',
                    order: 40,
                    table: 'x_maf_core_metric_result',
                    title: 'Amber Metrics',
                },
            ],
        },
        {
            $id: Now.ID['fee451daaf1c4c6c9f04262669401cb2'],
            title: 'AI Summaries',
            order: 300,
            lists: [
                {
                    $id: Now.ID['4d769a0389d04abe92e99bb26f04331d'],
                    applicabilities: [
                        {
                            $id: Now.ID['8be5c4c8e2bd433782dbadd66c102ebb'],
                            applicability: 'b8b0e343cdc449368ddd9e2b64edfe6c',
                        },
                    ],
                    columns: 'assessment_run,provider,generated_at,token_count,error',
                    condition: '',
                    order: 10,
                    table: 'x_maf_core_ai_summary',
                    title: 'All Summaries',
                },
            ],
        },
    ],
})

/** sys_ux_page_registry — workspace shell at path /maf (UI Builder / Next Experience). */
Record({
    $id: Now.ID['c9fc3c4cae4e424f9415d7ee83789774'],
    table: 'sys_ux_page_registry',
    data: {
        active: true,
        admin_panel: '6fc21ed6cd3c496194fa8afdb8836da1',
        admin_panel_table: 'sys_ux_app_config',
        parent_app: 'c86a62e2c7022010099a308dc7c26022',
        path: 'maf',
        root_macroponent: 'c276387cc331101080d6d3658940ddd2',
        title: 'Maturity Assessment',
    },
})
