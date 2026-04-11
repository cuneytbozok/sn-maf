import { Role } from '@servicenow/sdk/core'

export const mafAdmin = Role({
  name: 'x_maf_core.admin',
  description: 'Full CRUD on all MAF tables; can execute assessment runs.',
  scopedAdmin: true,
  grantable: true,
})

export const mafUser = Role({
  name: 'x_maf_core.user',
  description: 'Read all MAF tables; can create and execute assessment runs.',
  grantable: true,
})

export const mafViewer = Role({
  name: 'x_maf_core.viewer',
  description: 'Read assessment runs, metric results, category scores, and AI summaries.',
  grantable: true,
})
