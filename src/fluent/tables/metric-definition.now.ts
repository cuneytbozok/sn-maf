import '@servicenow/sdk/global'
import { Table, StringColumn, ReferenceColumn, ChoiceColumn, BooleanColumn, DecimalColumn } from '@servicenow/sdk/core'

export const x_maf_core_metric_definition = Table({
    callerAccess: 'restricted',
    display: 'label',
    index: [
        {
            name: 'index',
            unique: false,
            element: 'category',
        },
        {
            name: 'index2',
            unique: true,
            element: ['category', 'name'],
        },
        {
            name: 'index3',
            unique: false,
            element: 'sub_category',
        },
    ],
    label: 'MAF Metric Definition',
    name: 'x_maf_core_metric_definition',
    schema: {
        description: StringColumn({
            label: 'Description',
            maxLength: 4000,
        }),
        sub_category: ReferenceColumn({
            attributes: {
                encode_utf8: false,
            },
            cascadeRule: 'clear',
            label: 'Sub-category',
            referenceTable: 'x_maf_core_sub_category',
        }),
        collector_type: ChoiceColumn({
            default: 'declarative',
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
            dropdown: 'dropdown_with_none',
            label: 'Collector type',
            mandatory: true,
        }),
        manual_guidance_text: StringColumn({
            label: 'Manual guidance',
            maxLength: 4000,
        }),
        name: StringColumn({
            label: 'Name',
            mandatory: true,
            maxLength: 60,
        }),
        label: StringColumn({
            label: 'Label',
            mandatory: true,
            maxLength: 120,
        }),
        aggregation: ChoiceColumn({
            choices: {
                sum: {
                    label: 'Sum',
                },
                avg: {
                    label: 'Average',
                },
                count: {
                    label: 'Count',
                },
                percentage: {
                    label: 'Percentage',
                },
                count_distinct: {
                    label: 'Count distinct',
                },
            },
            dropdown: 'dropdown_with_none',
            label: 'Aggregation',
        }),
        script_params: StringColumn({
            label: 'Script parameters (JSON)',
            maxLength: 4000,
        }),
        higher_is_better: BooleanColumn({
            default: true,
            label: 'Higher is better',
        }),
        aggregation_field: StringColumn({
            label: 'Aggregation field',
            maxLength: 80,
        }),
        target_value: DecimalColumn({
            scale: 2,
            label: 'Target value',
        }),
        weight_in_category: DecimalColumn({
            scale: 2,
            label: 'Weight in sub-category',
        }),
        source_table: StringColumn({
            label: 'Source table',
            maxLength: 80,
        }),
        denominator_filter: StringColumn({
            label: 'Denominator filter',
            maxLength: 4000,
        }),
        threshold_red: DecimalColumn({
            scale: 2,
            label: 'Threshold (red)',
        }),
        unit: StringColumn({
            label: 'Unit',
            maxLength: 20,
        }),
        category: ReferenceColumn({
            attributes: {
                encode_utf8: false,
            },
            cascadeRule: 'cascade',
            label: 'Category',
            mandatory: true,
            referenceTable: 'x_maf_core_category',
        }),
        filter_condition: StringColumn({
            label: 'Filter condition',
            maxLength: 4000,
        }),
        script_include: StringColumn({
            label: 'Script include class',
            maxLength: 120,
        }),
        threshold_amber: DecimalColumn({
            scale: 2,
            label: 'Threshold (amber)',
        }),
        active: BooleanColumn({
            default: true,
            label: 'Active',
        }),
        default_likely_cause: StringColumn({
            label: 'Default likely cause',
            maxLength: 1000,
        }),
        default_suggested_action: StringColumn({
            label: 'Default suggested action',
            maxLength: 2000,
        }),
        default_owner_role: ChoiceColumn({
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
            label: 'Default owner role',
        }),
        default_effort_tshirt: ChoiceColumn({
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
            label: 'Default effort (t-shirt)',
        }),
        default_quick_win_flag: BooleanColumn({
            default: false,
            label: 'Default quick win',
        }),
        collector_capability: ReferenceColumn({
            attributes: {
                encode_utf8: false,
            },
            cascadeRule: 'clear',
            label: 'Collector capability',
            referenceTable: 'x_maf_core_collector_capability',
        }),
    },
})
