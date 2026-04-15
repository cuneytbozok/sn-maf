import { Property } from '@servicenow/sdk/core'

Property({
    $id: Now.ID['0b49c10d43bb4ce69525f41ac1e38e82'],
    name: 'x_maf_core.ai_provider',
    value: 'rest_llm',
    description: 'AI provider for executive summaries (stub, Now Assist, REST LLM).',
    type: 'choicelist',
    choices: ['stub', 'now_assist', 'rest_llm'],
    roles: {
        read: ['x_maf_core.admin', 'x_maf_core.user', 'x_maf_core.viewer'],
        write: ['x_maf_core.admin'],
    },
})
