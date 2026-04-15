import { UiAction } from '@servicenow/sdk/core'

UiAction({
    $id: Now.ID['a769c2bc90194b39b4894eb08515bda6'],
    table: 'x_maf_core_assessment_run',
    name: 'Execute Run',
    actionName: 'maf_execute_run',
    form: {
        showButton: true,
        style: 'primary',
    },
    workspace: {
        clientScriptV2: `function onClick(g_form) {

}`,
        showFormButtonV2: true,
        isConfigurableWorkspace: true,
    },
    messages: [],
    condition: "current.state == 'draft'",
    script: `var runner = new MAFAssessmentRunner();
var ok = runner.run(current.getUniqueValue());
if (ok) {
  gs.addInfoMessage('Run started');
} else {
  gs.addErrorMessage('Could not start the assessment run.');
}
action.setRedirectURL(current);`,
    hint: 'Collect metrics, score categories, and generate AI summary in the background.',
    showUpdate: true,
    showInsert: true,
    roles: ['x_maf_core.admin', 'x_maf_core.user'],
})
