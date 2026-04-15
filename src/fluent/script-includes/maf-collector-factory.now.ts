import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafCollectorFactory = ScriptInclude({
    $id: Now.ID['5caf1234d6e7568901f2a3b4c5d6e7f8'],
    name: 'MAFCollectorFactory',
    description: 'Resolves scoped Script Include collector classes for MAF (PRD §6.1).',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFCollectorFactory.server.js'),
    apiName: 'x_maf_core.MAFCollectorFactory',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
