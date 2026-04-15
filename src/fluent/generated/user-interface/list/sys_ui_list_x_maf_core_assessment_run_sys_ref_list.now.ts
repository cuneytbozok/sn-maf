import { List } from '@servicenow/sdk/core'

List({
    table: 'x_maf_core_assessment_run',
    view: 'sys_ref_list',
    columns: ['number'],
})
