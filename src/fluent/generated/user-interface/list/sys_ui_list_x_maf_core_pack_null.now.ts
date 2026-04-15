import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_maf_core_pack',
    view: default_view,
    columns: ['name', 'active', 'description', 'label', 'order', 'vendor', 'version'],
})
