import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_maf_core_ai_summary',
    view: default_view,
    columns: [
        'assessment_run',
        'error',
        'executive_summary',
        'generated_at',
        'provider',
        'token_count',
        'top_recommendations',
    ],
})
