import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_maf_core_category',
    view: default_view,
    columns: ['name', 'description', 'label', 'order', 'pack', 'weight'],
})
