import { ChoiceColumn, DecimalColumn, IntegerColumn, ReferenceColumn, Table } from '@servicenow/sdk/core'

export const x_maf_core_category_score = Table({
    name: 'x_maf_core_category_score',
    label: 'MAF Category Score',
    accessibleFrom: 'public',
    callerAccess: 'restricted',
    index: [
        {
            name: 'idx_maf_category_score_run_category',
            unique: false,
            element: ['assessment_run', 'category'],
        },
    ],
    schema: {
        assessment_run: ReferenceColumn({
            label: 'Assessment run',
            referenceTable: 'x_maf_core_assessment_run',
            mandatory: true,
            cascadeRule: 'cascade',
            attributes: { dashboard_filter: true, encode_utf8: false },
        }),
        category: ReferenceColumn({
            label: 'Category',
            referenceTable: 'x_maf_core_category',
            mandatory: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        score: DecimalColumn({
            label: 'Score',
            scale: 2,
        }),
        rag_status: ChoiceColumn({
            label: 'RAG status',
            choices: {
                red: { label: 'Red' },
                amber: { label: 'Amber' },
                green: { label: 'Green' },
            },
            mandatory: true,
            dropdown: 'dropdown_with_none',
        }),
        metrics_total: IntegerColumn({
            label: 'Metrics total',
        }),
        metrics_green: IntegerColumn({
            label: 'Metrics green',
        }),
        metrics_amber: IntegerColumn({
            label: 'Metrics amber',
        }),
        metrics_red: IntegerColumn({
            label: 'Metrics red',
        }),
        metrics_error: IntegerColumn({
            label: 'Metrics error',
        }),
    },
})
