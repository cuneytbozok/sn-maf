import { Table, StringColumn, DecimalColumn, ReferenceColumn, IntegerColumn } from '@servicenow/sdk/core'

export const x_maf_core_category = Table({
    callerAccess: 'restricted',
    display: 'label',
    index: [
        {
            name: 'index',
            unique: true,
            element: ['pack', 'name'],
        },
        {
            name: 'index2',
            unique: false,
            element: 'pack',
        },
    ],
    label: 'MAF Category',
    name: 'x_maf_core_category',
    schema: {
        label: StringColumn({
            label: 'Label',
            mandatory: true,
            maxLength: 80,
        }),
        name: StringColumn({
            label: 'Name',
            mandatory: true,
        }),
        description: StringColumn({
            label: 'Description',
            maxLength: 4000,
        }),
        weight: DecimalColumn({
            scale: 2,
            label: 'Weight',
            mandatory: true,
        }),
        pack: ReferenceColumn({
            attributes: {
                encode_utf8: false,
            },
            cascadeRule: 'cascade',
            label: 'Pack',
            mandatory: true,
            referenceTable: 'x_maf_core_pack',
        }),
        order: IntegerColumn({
            label: 'Order',
        }),
    },
})
