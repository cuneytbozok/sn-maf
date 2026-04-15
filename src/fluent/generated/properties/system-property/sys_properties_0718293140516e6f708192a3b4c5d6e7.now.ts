import { Property } from '@servicenow/sdk/core'

Property({
    $id: Now.ID['0718293140516e6f708192a3b4c5d6e7'],
    name: 'x_maf_core.rest_llm_model',
    value: 'gpt-5.4',
    description: 'Model name sent in the chat completions request body (OpenAI-compatible APIs).',
    roles: {
        read: ['x_maf_core.admin', 'x_maf_core.user', 'x_maf_core.viewer'],
        write: ['x_maf_core.admin'],
    },
})
