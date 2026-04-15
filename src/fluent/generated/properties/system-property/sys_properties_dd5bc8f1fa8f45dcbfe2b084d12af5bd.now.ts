import { Property } from '@servicenow/sdk/core'

Property({
    $id: Now.ID['dd5bc8f1fa8f45dcbfe2b084d12af5bd'],
    name: 'x_maf_core.max_concurrent_runs',
    value: '1',
    description: 'Maximum assessment runs in Running state at once.',
    type: 'integer',
    roles: {
        read: ['x_maf_core.admin', 'x_maf_core.user', 'x_maf_core.viewer'],
        write: ['x_maf_core.admin'],
    },
})
