/**
 * Builds global list URLs for metric drill-down (PRD §13.2).
 * Use from formatters: path is relative to the instance root.
 */
var MAFDrillDownBuilder = Class.create()
MAFDrillDownBuilder.prototype = {
  /**
   * @param {string} table Table name (e.g. incident)
   * @param {string} encodedQuery Encoded query string (no leading ?)
   * @returns {string} e.g. /incident_list.do?sysparm_query=...
   */
  buildListUrl: function (table, encodedQuery) {
    if (!table) return ''
    var path = '/' + table + '_list.do'
    if (encodedQuery) path += '?sysparm_query=' + encodeURIComponent(encodedQuery)
    return path
  },

  type: 'MAFDrillDownBuilder',
}
