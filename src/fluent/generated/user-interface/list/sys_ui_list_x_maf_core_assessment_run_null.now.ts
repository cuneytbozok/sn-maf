import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_maf_core_assessment_run',
    view: default_view,
    columns: [
        'number',
        'name',
        'completed_at',
        'error_message',
        'overall_notes',
        'packs',
        'started_at',
        'state',
        'triggered_by',
    ],
})
