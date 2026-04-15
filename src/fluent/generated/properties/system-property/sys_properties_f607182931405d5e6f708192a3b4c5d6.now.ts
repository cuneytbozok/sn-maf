import { Property } from '@servicenow/sdk/core'

Property({
    $id: Now.ID['f607182931405d5e6f708192a3b4c5d6'],
    name: 'x_maf_core.rest_llm_api_key',
    value: `{{gpaes}}ju52WA3A0jweeCHi+CvmZ1lE6MGn3cnT5P3HKU4UvaXpC6xJ6Kvqdp0UtAC2f1wMRJZL8kA4IB4G&#13;
9yDgj2uaQu7aLmH1SR3wR99tZg9a3Z5fcD0UjRhfCKA9zSJaODuDT5BQ12vkO9eNlmIym1+FPWLq&#13;
bha66Qe57+fPv9cpm1F7dHxumyBwV2su+2wHUYulH7pLpmrhp3/LDeKqaEppEdaLOFBawV/CryzL&#13;
DN7/fNM=`,
    description:
        'Bearer token for rest_llm_chat_url (Authorization header). Leave empty for local endpoints that do not require auth.',
    type: 'password',
    roles: {
        read: ['x_maf_core.admin'],
        write: ['x_maf_core.admin'],
    },
})
