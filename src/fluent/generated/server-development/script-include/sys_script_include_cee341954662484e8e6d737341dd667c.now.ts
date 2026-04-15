import { ScriptInclude } from '@servicenow/sdk/core'

ScriptInclude({
    $id: Now.ID['cee341954662484e8e6d737341dd667c'],
    name: 'MAFDrillDownBuilder',
    script: Now.include('./sys_script_include_cee341954662484e8e6d737341dd667c.server.js'),
    description: 'Builds global table list URLs for metric drill-down (PRD §13.2).',
    apiName: 'x_maf_core.MAFDrillDownBuilder',
    clientCallable: false,
    mobileCallable: false,
    sandboxCallable: false,
    active: true,
})
