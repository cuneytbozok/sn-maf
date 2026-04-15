import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_maf_core_sub_category',
    view: default_view,
    columns: ['name', 'active', 'category', 'description', 'label', 'order', 'weight_in_category'],
})
