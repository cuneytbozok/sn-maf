import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_maf_core_metric_definition',
    view: default_view,
    columns: [
        'name',
        'active',
        'aggregation',
        'aggregation_field',
        'category',
        'collector_type',
        'denominator_filter',
        'description',
        'filter_condition',
        'higher_is_better',
    ],
})
