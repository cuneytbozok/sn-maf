import { Property } from '@servicenow/sdk/core'

Property({
    $id: Now.ID['b041a0a150c341e19dc33ad7ba0ea745'],
    name: 'x_maf_core.rest_llm_message',
    value: 'x_maf_core_llm_generate',
    description: 'REST message record name for REST LLM provider.',
    roles: {
        read: ['x_maf_core.admin', 'x_maf_core.user', 'x_maf_core.viewer'],
        write: ['x_maf_core.admin'],
    },
})
