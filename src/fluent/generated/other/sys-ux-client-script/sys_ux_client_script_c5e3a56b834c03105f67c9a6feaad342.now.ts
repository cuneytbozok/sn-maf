import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['c5e3a56b834c03105f67c9a6feaad342'],
    table: 'sys_ux_client_script',
    data: {
        macroponent: '06f269a7834c03105f67c9a6feaad3c8',
        name: 'rich_text_1/html',
        required_translations: '[]',
        script: `/**
  * @param {params} params
  * @param {api} params.api
  * @param {TransformApiHelpers} params.helpers
  */
function evaluateProperty({ api, helpers }) {
  var html = api.data.look_up_multiple_records_1.results[0].executive_summary.value

  // Keep on one string per rule if you like; no </style> inside the CSS text
  var css =
    '.maf-ai-llm-summary{font-size:0.9375rem;line-height:1.6;color:#1a1a1a;}' +
    '.maf-ai-llm-summary>p:first-of-type{margin:0 0 1rem;padding:1rem 1.125rem;border-radius:8px;background:#f4f4f4;border:1px solid #e0e0e0}' +
    '.maf-ai-llm-summary h3{margin:1.5rem 0 0.75rem;font-size:1.05rem;font-weight:600;border-bottom:2px solid #0070f3;padding-bottom:0.35rem}' +
    '.maf-ai-llm-summary table{width:100%;border-collapse:collapse;font-size:0.8125rem;margin:0.75rem 0 1.25rem;border:1px solid #e0e0e0}' +
    '.maf-ai-llm-summary thead{background:#f4f4f4}' +
    '.maf-ai-llm-summary th,.maf-ai-llm-summary td{padding:0.5rem 0.65rem;text-align:left;vertical-align:top;border-bottom:1px solid #e0e0e0}' +
    '.maf-ai-llm-summary tbody tr:nth-child(even){background:#fafafa}' +
    '.maf-ai-llm-summary ul{margin:0.5rem 0 1rem;padding-left:1.25rem}' +
    '.maf-ai-llm-summary li{margin:0.35rem 0}' +
    '.maf-ai-llm-summary strong{font-weight:650}'

  return '<div class="maf-ai-llm-summary"><style>' + css + '</style>' + html + '</div>'
}`,
        script_api_version: '2.0.0',
        target: 'macroponent',
        type: 'transform',
    },
})
