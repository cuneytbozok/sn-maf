import { Table, ReferenceColumn, IntegerColumn, DecimalColumn, ChoiceColumn } from '@servicenow/sdk/core'

export const x_maf_core_sub_category_score = Table({
    callerAccess: 'restricted',
    index: [
        {
            name: 'index',
            unique: false,
            element: 'assessment_run',
        },
        {
            name: 'index2',
            unique: false,
            element: ['assessment_run', 'sub_category'],
        },
        {
            name: 'index3',
            unique: false,
            element: 'sub_category',
        },
    ],
    label: 'MAF Sub-category Score',
    name: 'x_maf_core_sub_category_score',
    schema: {
        sub_category: ReferenceColumn({
            attributes: {
                encode_utf8: false,
            },
            label: 'Sub-category',
            mandatory: true,
            referenceTable: 'x_maf_core_sub_category',
        }),
        metrics_green: IntegerColumn({
            label: 'Metrics green',
        }),
        metrics_amber: IntegerColumn({
            label: 'Metrics amber',
        }),
        score: DecimalColumn({
            scale: 2,
            label: 'Score',
        }),
        rag_status: ChoiceColumn({
            choices: {
                amber: {
                    label: 'Amber',
                },
                green: {
                    label: 'Green',
                },
                red: {
                    label: 'Red',
                },
            },
            dropdown: 'dropdown_with_none',
            label: 'RAG status',
            mandatory: true,
        }),
        metrics_red: IntegerColumn({
            label: 'Metrics red',
        }),
        assessment_run: ReferenceColumn({
            attributes: {
                dashboard_filter: true,
                encode_utf8: false,
            },
            cascadeRule: 'cascade',
            label: 'Assessment run',
            mandatory: true,
            referenceTable: 'x_maf_core_assessment_run',
        }),
        metrics_total: IntegerColumn({
            label: 'Metrics total',
        }),
        metrics_error: IntegerColumn({
            label: 'Metrics error',
        }),
    },
})
