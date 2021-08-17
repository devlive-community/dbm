const StringUtils = require('./StringUtils')

export function buildDdl(element) {
  let response = null
  if (StringUtils.isNotEmpty(element)) {
    response = StringUtils.format(`
CREATE TABLE {0}.{1} (
    {2}
) ENGINE = {3}
    SETTINGS index_granularity = 8192
`, [element.database, element.table.name, builderColumnsToString(element.table.columns), element.type])
  }
  return response
}

function builderColumnsToString(columns) {
  let columnStr = ''
  columns.forEach((value, index) => {
    if (index !== columns.length - 1) {
      columnStr += builderColumnToString(value, true)
    } else {
      columnStr += builderColumnToString(value, false)
    }
  })
  return columnStr
}

function builderColumnToString(value, end) {
  let column
  const dStr = StringUtils.format('{0} {1}', [value.name, value.type])
  const endStr = end ? ',\n' : ''
  if (StringUtils.isNotEmpty(value.comment)) {
    column = StringUtils.format('{0} {1} {2}', [dStr, value.comment, endStr])
  } else {
    column = StringUtils.format('{0} {1}', [dStr, endStr])
  }
  return column
}
