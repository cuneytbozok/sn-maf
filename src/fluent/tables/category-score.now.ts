import '@servicenow/sdk/global'
import { ChoiceColumn, DecimalColumn, IntegerColumn, ReferenceColumn, StringColumn, Table } from '@servicenow/sdk/core'

export const x_maf_core_category_score = Table({
    name: 'x_maf_core_category_score',
    label: 'MAF Category Score',
    accessibleFrom: 'public',
    callerAccess: 'restricted',
    index: [
        {
            name: 'index',
            unique: false,
            element: ['assessment_run', 'category'],
        },
        {
            name: 'index2',
            unique: false,
            element: 'category',
        },
    ],
    schema: {
        assessment_run: ReferenceColumn({
            label: 'Assessment run',
            referenceTable: 'x_maf_core_assessment_run',
            mandatory: true,
            cascadeRule: 'cascade',
            attributes: { dashboard_filter: true, encode_utf8: false },
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        category: ReferenceColumn({
            label: 'Category',
            referenceTable: 'x_maf_core_category',
            mandatory: true,
            attributes: {
                encode_utf8: false,
            },
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        score: DecimalColumn({
            label: 'Score',
            scale: 2,
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        rag_status: ChoiceColumn({
            label: 'RAG status',
            choices: {
                red: { label: 'Red', sequence: 2 },
                amber: { label: 'Amber', sequence: 0 },
                green: { label: 'Green', sequence: 1 },
            },
            mandatory: true,
            dropdown: 'dropdown_with_none',
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        metrics_total: IntegerColumn({
            label: 'Metrics total',
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        metrics_green: IntegerColumn({
            label: 'Metrics green',
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        metrics_amber: IntegerColumn({
            label: 'Metrics amber',
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        metrics_red: IntegerColumn({
            label: 'Metrics red',
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        metrics_error: IntegerColumn({
            label: 'Metrics error',
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        metrics_pending: IntegerColumn({
            label: 'Metrics pending input',
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        number: StringColumn({
            attributes: {
                ignore_filter_on_new: true,
            },
            default: 'javascript:global.getNextObjNumberPadded();',
            label: 'Number',
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
    },
    autoNumber: {
        prefix: 'MAFCS',
    },
    display: 'number',
})
