import {
    Table,
    ReferenceColumn,
    DateTimeColumn,
    IntegerColumn,
    ChoiceColumn,
    HtmlColumn,
    StringColumn,
} from '@servicenow/sdk/core'

export const x_maf_core_ai_summary = Table({
    callerAccess: 'restricted',
    index: [
        {
            name: 'index',
            unique: false,
            element: 'assessment_run',
        },
    ],
    label: 'MAF AI Summary',
    name: 'x_maf_core_ai_summary',
    schema: {
        assessment_run: ReferenceColumn({
            attributes: {
                dashboard_filter: true,
                encode_utf8: false,
            },
            cascadeRule: 'cascade',
            label: 'Assessment run',
            mandatory: true,
            referenceTable: 'x_maf_core_assessment_run',
            unique: true,
        }),
        generated_at: DateTimeColumn({
            label: 'Generated at',
        }),
        token_count: IntegerColumn({
            label: 'Token count',
        }),
        provider: ChoiceColumn({
            default: 'stub',
            choices: {
                stub: {
                    label: 'Stub',
                },
                now_assist: {
                    label: 'Now Assist',
                },
                rest_llm: {
                    label: 'REST LLM',
                },
            },
            dropdown: 'dropdown_with_none',
            label: 'Provider',
            mandatory: true,
        }),
        executive_summary: HtmlColumn({
            label: 'Executive summary',
        }),
        error: StringColumn({
            label: 'Error',
            maxLength: 4000,
        }),
        top_recommendations: StringColumn({
            label: 'Top recommendations (JSON)',
            maxLength: 8000,
        }),
    },
})
