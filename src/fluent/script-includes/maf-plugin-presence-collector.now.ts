import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const mafPluginPresenceCollector = ScriptInclude({
    $id: Now.ID['9d1c5b38c5df4c9ca9b7012e8ed278ee'],
    name: 'MAFPluginPresenceCollector',
    description: 'v_plugin active check; script_params.plugin_id (0/100 score).',
    accessibleFrom: 'package_private',
    script: Now.include('../../server/script-includes/MAFPluginPresenceCollector.server.js'),
    apiName: 'x_maf_core.MAFPluginPresenceCollector',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
    protectionPolicy: 'read',
})
