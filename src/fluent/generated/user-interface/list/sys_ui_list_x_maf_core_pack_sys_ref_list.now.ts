import { List } from '@servicenow/sdk/core'

List({
    table: 'x_maf_core_pack',
    view: 'sys_ref_list',
    columns: ['label'],
})
