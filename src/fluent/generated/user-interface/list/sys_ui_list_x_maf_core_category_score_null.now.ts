import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_maf_core_category_score',
    view: default_view,
    columns: [
        'number',
        'assessment_run',
        'category',
        'metrics_amber',
        'metrics_error',
        'metrics_green',
        'metrics_red',
        'metrics_total',
        'rag_status',
        'score',
    ],
})
