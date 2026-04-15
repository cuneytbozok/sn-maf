import { ApplicationMenu } from '@servicenow/sdk/core'

ApplicationMenu({
    $id: Now.ID['1cfcd19f7bb24ab5bddb7d8b2983c6f3'],
    title: 'Maturity Assessment',
    category: '',
    hint: 'MAF',
    description: 'Maturity Assessment Framework — packs, runs, and scores.',
    order: 1000,
    roles: ['x_maf_core.admin', 'x_maf_core.user', 'x_maf_core.viewer'],
})
