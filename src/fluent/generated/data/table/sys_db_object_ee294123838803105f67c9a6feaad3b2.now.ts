import { Table, StringColumn, ReferenceColumn, IntegerColumn, DecimalColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_maf_core_sub_category = Table({
    callerAccess: 'restricted',
    display: 'label',
    index: [
        {
            name: 'index',
            unique: true,
            element: ['category', 'name'],
        },
        {
            name: 'index2',
            unique: false,
            element: 'category',
        },
    ],
    label: 'MAF Sub-category',
    name: 'x_maf_core_sub_category',
    schema: {
        description: StringColumn({
            label: 'Description',
            maxLength: 4000,
        }),
        category: ReferenceColumn({
            attributes: {
                encode_utf8: false,
            },
            cascadeRule: 'cascade',
            label: 'Category',
            mandatory: true,
            referenceTable: 'x_maf_core_category',
        }),
        order: IntegerColumn({
            label: 'Order',
        }),
        weight_in_category: DecimalColumn({
            scale: 3,
            label: 'Weight in category',
            mandatory: true,
        }),
        name: StringColumn({
            label: 'Name',
            mandatory: true,
        }),
        active: BooleanColumn({
            default: true,
            label: 'Active',
        }),
        label: StringColumn({
            label: 'Label',
            mandatory: true,
            maxLength: 80,
        }),
    },
})
