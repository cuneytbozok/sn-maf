import { List } from '@servicenow/sdk/core'

List({
    table: 'x_maf_core_sub_category',
    view: 'sys_ref_list',
    columns: ['label'],
})
