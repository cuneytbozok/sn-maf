import '@servicenow/sdk/global'
import { Table, StringColumn, BooleanColumn, IntegerColumn } from '@servicenow/sdk/core'

export const x_maf_core_pack = Table({
    callerAccess: 'restricted',
    display: 'label',
    index: [
        {
            name: 'index',
            unique: true,
            element: 'name',
        },
    ],
    label: 'MAF Pack',
    name: 'x_maf_core_pack',
    schema: {
        label: StringColumn({
            label: 'Label',
            mandatory: true,
            maxLength: 80,
        }),
        active: BooleanColumn({
            default: true,
            label: 'Active',
        }),
        description: StringColumn({
            label: 'Description',
            maxLength: 4000,
        }),
        order: IntegerColumn({
            label: 'Order',
        }),
        version: StringColumn({
            label: 'Version',
            maxLength: 20,
        }),
        vendor: StringColumn({
            label: 'Vendor',
            maxLength: 80,
        }),
        name: StringColumn({
            label: 'Name',
            mandatory: true,
            unique: true,
        }),
    },
})
