import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_maf_core_metric_result',
    view: default_view,
    columns: [
        'assessment_run',
        'collected_at',
        'collection_error',
        'drill_down_query',
        'drill_down_table',
        'metric_definition',
        'normalized_score',
        'rag_status',
        'raw_value',
    ],
})
