import '@servicenow/sdk/global'
import {
    Table,
    ReferenceColumn,
    StringColumn,
    DecimalColumn,
    ChoiceColumn,
    DateTimeColumn,
    BooleanColumn,
} from '@servicenow/sdk/core'

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
                pending_input: {
                    label: 'Pending input',
                    sequence: 4,
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
        previous_raw_value: DecimalColumn({
            scale: 4,
            label: 'Previous raw value',
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        delta: DecimalColumn({
            scale: 4,
            label: 'Delta (raw)',
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        delta_percent: DecimalColumn({
            scale: 2,
            label: 'Delta %',
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        previous_assessment_run: ReferenceColumn({
            attributes: {
                encode_utf8: false,
            },
            cascadeRule: 'clear',
            label: 'Previous assessment run',
            readOnly: true,
            readOnlyOption: 'instance_configured',
            referenceTable: 'x_maf_core_assessment_run',
        }),
        likely_cause: StringColumn({
            label: 'Likely cause',
            maxLength: 1000,
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        suggested_action: StringColumn({
            label: 'Suggested action',
            maxLength: 2000,
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        owner_role: ChoiceColumn({
            choices: {
                process_owner: {
                    label: 'Process owner',
                },
                platform_owner: {
                    label: 'Platform owner',
                },
                developer: {
                    label: 'Developer',
                },
                admin: {
                    label: 'Administrator',
                },
                data_steward: {
                    label: 'Data steward',
                },
                security: {
                    label: 'Security',
                },
                integration_owner: {
                    label: 'Integration owner',
                },
            },
            dropdown: 'dropdown_with_none',
            label: 'Owner role',
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        effort_tshirt: ChoiceColumn({
            choices: {
                xs: {
                    label: 'XS',
                },
                s: {
                    label: 'S',
                },
                m: {
                    label: 'M',
                },
                l: {
                    label: 'L',
                },
                xl: {
                    label: 'XL',
                },
            },
            dropdown: 'dropdown_with_none',
            label: 'Effort (t-shirt)',
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        quick_win_flag: BooleanColumn({
            default: false,
            label: 'Quick win',
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        // result_mode mirrors metric_definition.collector_type at insert time so UI
        // policies can condition on this single field instead of dot-walking.
        result_mode: ChoiceColumn({
            choices: {
                auto: {
                    label: 'Automatic',
                },
                manual: {
                    label: 'Manual',
                },
            },
            default: 'auto',
            dropdown: 'dropdown_with_none',
            label: 'Result mode',
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        manual_response_notes: StringColumn({
            label: 'Manual response notes',
            maxLength: 4000,
        }),
        manual_evidence: StringColumn({
            label: 'Manual evidence',
            maxLength: 4000,
        }),
        manual_answered_by: ReferenceColumn({
            attributes: {
                encode_utf8: false,
            },
            cascadeRule: 'clear',
            label: 'Manual answered by',
            referenceTable: 'sys_user',
        }),
        manual_answered_at: DateTimeColumn({
            label: 'Manual answered at',
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
    },
})
