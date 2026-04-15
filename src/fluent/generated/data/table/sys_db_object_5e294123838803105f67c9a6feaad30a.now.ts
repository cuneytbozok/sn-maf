import { Table, ReferenceColumn, StringColumn, DecimalColumn, ChoiceColumn, DateTimeColumn } from '@servicenow/sdk/core'

export const x_maf_core_metric_result = Table({
    autoNumber: {
        prefix: 'MAFMR',
    },
    callerAccess: 'restricted',
    display: 'number',
    index: [
        {
            name: 'index',
            unique: false,
            element: 'assessment_run',
        },
        {
            name: 'index2',
            unique: false,
            element: ['assessment_run', 'metric_definition'],
        },
        {
            name: 'index3',
            unique: false,
            element: 'metric_definition',
        },
    ],
    label: 'MAF Metric Result',
    name: 'x_maf_core_metric_result',
    schema: {
        metric_definition: ReferenceColumn({
            attributes: {
                encode_utf8: false,
            },
            cascadeRule: 'restrict',
            label: 'Metric definition',
            mandatory: true,
            readOnly: true,
            readOnlyOption: 'instance_configured',
            referenceTable: 'x_maf_core_metric_definition',
        }),
        collection_error: StringColumn({
            label: 'Collection error',
            maxLength: 4000,
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
        raw_value: DecimalColumn({
            scale: 4,
            label: 'Raw value',
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        drill_down_query: StringColumn({
            label: 'Drill-down query',
            maxLength: 4000,
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        drill_down_table: StringColumn({
            label: 'Drill-down table',
            maxLength: 80,
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        normalized_score: DecimalColumn({
            scale: 2,
            label: 'Normalized score',
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        rag_status: ChoiceColumn({
            choices: {
                amber: {
                    label: 'Amber',
                    sequence: 0,
                },
                green: {
                    label: 'Green',
                    sequence: 2,
                },
                error: {
                    label: 'Error',
                    sequence: 1,
                },
                red: {
                    label: 'Red',
                    sequence: 3,
                },
            },
            dropdown: 'dropdown_with_none',
            label: 'RAG status',
            mandatory: true,
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        collected_at: DateTimeColumn({
            label: 'Collected at',
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        assessment_run: ReferenceColumn({
            attributes: {
                dashboard_filter: true,
                encode_utf8: false,
            },
            cascadeRule: 'cascade',
            label: 'Assessment run',
            mandatory: true,
            readOnly: true,
            readOnlyOption: 'instance_configured',
            referenceTable: 'x_maf_core_assessment_run',
        }),
    },
})
