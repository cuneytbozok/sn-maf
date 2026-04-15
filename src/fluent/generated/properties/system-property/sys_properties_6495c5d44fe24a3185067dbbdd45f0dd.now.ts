import { Property } from '@servicenow/sdk/core'

Property({
    $id: Now.ID['6495c5d44fe24a3185067dbbdd45f0dd'],
    name: 'x_maf_core.score_threshold_amber',
    value: '50',
    description: 'Category score at or above this threshold is amber.',
    type: 'integer',
    roles: {
        read: ['x_maf_core.admin', 'x_maf_core.user', 'x_maf_core.viewer'],
        write: ['x_maf_core.admin'],
    },
})
