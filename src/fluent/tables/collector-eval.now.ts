import '@servicenow/sdk/global'
import { Table, ScriptColumn } from '@servicenow/sdk/core'

export const x_maf_core_collector_eval = Table({
    callerAccess: 'restricted',
    label: 'MAF Collector Eval',
    name: 'x_maf_core_collector_eval',
    schema: {
        script: ScriptColumn({
            label: 'Script',
        }),
    },
})
