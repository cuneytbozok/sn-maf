import '@servicenow/sdk/global'
import { Table, StringColumn, ChoiceColumn, BooleanColumn } from '@servicenow/sdk/core'

/**
 * Descriptive catalog of collector capabilities — parameter schema, sample response,
 * failure modes. Pack authors reference this to pick the right collector for a
 * metric. NOT enforced at runtime (plan phase 3).
 */
export const x_maf_core_collector_capability = Table({
    callerAccess: 'restricted',
    display: 'label',
    index: [
        {
            name: 'index',
            unique: true,
            element: 'code',
        },
    ],
    label: 'MAF Collector Capability',
    name: 'x_maf_core_collector_capability',
    schema: {
        code: StringColumn({
            label: 'Code',
            mandatory: true,
            unique: true,
            maxLength: 80,
        }),
        label: StringColumn({
            label: 'Label',
            mandatory: true,
            maxLength: 120,
        }),
        description: StringColumn({
            label: 'Description',
            maxLength: 4000,
        }),
        collector_mode: ChoiceColumn({
            choices: {
                declarative: {
                    label: 'Declarative',
                },
                script_include: {
                    label: 'Script include',
                },
                manual: {
                    label: 'Manual',
                },
            },
            default: 'script_include',
            dropdown: 'dropdown_with_none',
            label: 'Collector mode',
            mandatory: true,
        }),
        script_include: StringColumn({
            label: 'Script include class',
            maxLength: 120,
        }),
        supported_output_type: ChoiceColumn({
            choices: {
                count: {
                    label: 'Count',
                },
                percentage: {
                    label: 'Percentage',
                },
                ratio: {
                    label: 'Ratio',
                },
                duration: {
                    label: 'Duration',
                },
                score: {
                    label: 'Score (0-100)',
                },
                boolean: {
                    label: 'Boolean (0/1)',
                },
            },
            dropdown: 'dropdown_with_none',
            label: 'Supported output type',
        }),
        supports_drilldown: BooleanColumn({
            default: true,
            label: 'Supports drill-down',
        }),
        required_params_schema_json: StringColumn({
            label: 'Required params schema (JSON)',
            maxLength: 4000,
        }),
        optional_params_schema_json: StringColumn({
            label: 'Optional params schema (JSON)',
            maxLength: 4000,
        }),
        sample_response_json: StringColumn({
            label: 'Sample response (JSON)',
            maxLength: 4000,
        }),
        failure_modes: StringColumn({
            label: 'Known failure modes',
            maxLength: 4000,
        }),
        active: BooleanColumn({
            default: true,
            label: 'Active',
        }),
    },
})
