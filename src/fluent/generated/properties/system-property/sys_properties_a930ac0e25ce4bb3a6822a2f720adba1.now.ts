import { Property } from '@servicenow/sdk/core'

Property({
    $id: Now.ID['a930ac0e25ce4bb3a6822a2f720adba1'],
    name: 'x_maf_core.score_threshold_green',
    value: '75',
    description: 'Category score at or above this threshold is green (PRD §8).',
    type: 'integer',
    roles: {
        read: ['x_maf_core.admin', 'x_maf_core.user', 'x_maf_core.viewer'],
        write: ['x_maf_core.admin'],
    },
})
