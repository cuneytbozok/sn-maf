import '@servicenow/sdk/global'
import { Table, ChoiceColumn, ReferenceColumn, StringColumn, ListColumn, DateTimeColumn } from '@servicenow/sdk/core'

export const x_maf_core_assessment_run = Table({
    allowUiActions: true,
    autoNumber: {
        prefix: 'MAF',
    },
    callerAccess: 'restricted',
    display: 'number',
    index: [
        {
            name: 'index',
            unique: false,
            element: 'triggered_by',
        },
    ],
    label: 'MAF Assessment Run',
    name: 'x_maf_core_assessment_run',
    schema: {
        state: ChoiceColumn({
            default: 'draft',
            choices: {
                complete: {
                    label: 'Complete',
                    sequence: 1,
                },
                running: {
                    label: 'Running',
                    sequence: 4,
                },
                error: {
                    label: 'Error',
                    sequence: 3,
                },
                collected: {
                    label: 'Collected',
                    sequence: 0,
                },
                scored: {
                    label: 'Scored',
                    sequence: 5,
                },
                draft: {
                    label: 'Draft',
                    sequence: 2,
                },
                summarized: {
                    label: 'Summarized',
                    sequence: 6,
                },
            },
            dropdown: 'dropdown_with_none',
            label: 'State',
            mandatory: true,
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        triggered_by: ReferenceColumn({
            attributes: {
                encode_utf8: false,
            },
            label: 'Triggered by',
            readOnly: true,
            readOnlyOption: 'instance_configured',
            referenceTable: 'sys_user',
        }),
        error_message: StringColumn({
            label: 'Error message',
            maxLength: 4000,
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        packs: ListColumn({
            attributes: {
                no_sort: true,
                slushbucket_ref_no_expand: true,
            },
            label: 'Packs',
            referenceTable: 'x_maf_core_pack',
        }),
        started_at: DateTimeColumn({
            label: 'Started at',
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        overall_notes: StringColumn({
            label: 'Overall notes',
            maxLength: 4000,
        }),
        number: StringColumn({
            default: 'javascript:global.getNextObjNumberPadded();',
            label: 'Number',
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
        name: StringColumn({
            label: 'Name',
            mandatory: true,
            maxLength: 120,
        }),
        completed_at: DateTimeColumn({
            label: 'Completed at',
            readOnly: true,
            readOnlyOption: 'instance_configured',
        }),
    },
})
