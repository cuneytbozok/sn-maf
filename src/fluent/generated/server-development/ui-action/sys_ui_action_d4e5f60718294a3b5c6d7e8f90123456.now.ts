import { UiAction } from '@servicenow/sdk/core'

UiAction({
    $id: Now.ID['d4e5f60718294a3b5c6d7e8f90123456'],
    table: 'x_maf_core_assessment_run',
    name: 'Generate AI Summary',
    actionName: 'maf_generate_ai_summary',
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
    condition: "current.state != 'draft' && current.state != 'running'",
    script: `gs.include('MAFAISummaryProvider');
var ai = new MAFAISummaryProvider();
ai.generate(current.getUniqueValue());
gs.addInfoMessage('AI summary generated. Review the MAF AI Summary related list on this run.');
var st = current.getValue('state');
if (st == 'scored' || st == 'summarized') {
  current.setValue('state', 'complete');
  if (!current.getValue('completed_at')) {
    current.setValue('completed_at', new GlideDateTime());
  }
  current.update();
}
action.setRedirectURL(current);`,
    hint: 'Build or refresh the MAF AI Summary (metrics JSON + prompt) on the related MAF AI Summary record.',
    order: 150,
    showUpdate: true,
    showInsert: false,
    roles: ['x_maf_core.user', 'x_maf_core.admin'],
})
