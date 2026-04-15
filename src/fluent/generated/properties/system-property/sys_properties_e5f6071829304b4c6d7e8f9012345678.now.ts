import { Property } from '@servicenow/sdk/core'

Property({
    $id: Now.ID['e5f6071829304b4c6d7e8f9012345678'],
    name: 'x_maf_core.rest_llm_chat_url',
    value: 'https://api.openai.com/v1/chat/completions',
    description:
        'OpenAI-compatible chat completions URL (e.g. https://api.openai.com/v1/chat/completions). When set with rest_llm_api_key, REST LLM provider POSTs JSON built from the assessment payload and prompts.',
    roles: {
        read: ['x_maf_core.admin', 'x_maf_core.user', 'x_maf_core.viewer'],
        write: ['x_maf_core.admin'],
    },
})
