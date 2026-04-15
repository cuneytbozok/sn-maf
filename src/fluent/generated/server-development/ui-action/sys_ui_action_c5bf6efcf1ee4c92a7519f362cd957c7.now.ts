import { UiAction } from '@servicenow/sdk/core'

UiAction({
    $id: Now.ID['c5bf6efcf1ee4c92a7519f362cd957c7'],
    table: 'x_maf_core_assessment_run',
    name: 'View Dashboard',
    actionName: 'maf_view_dashboard',
    form: {
        showButton: true,
        style: 'unstyled',
    },
    workspace: {
        clientScriptV2: `function onClick(g_form) {

}`,
        showFormButtonV2: true,
        isConfigurableWorkspace: true,
    },
    messages: [],
    condition: "current.state == 'complete' || current.state == 'summarized' || current.state == 'scored'",
    script: `action.setRedirectURL('/x/maf/maf/home');
`,
    hint: 'Open the Maturity Assessment Overview dashboard.',
    order: 200,
    showUpdate: true,
    showInsert: true,
    roles: ['x_maf_core.viewer', 'x_maf_core.admin', 'x_maf_core.user'],
})
