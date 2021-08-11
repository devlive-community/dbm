import { isNotEmpty } from './StringUtils'
import { stringFormat } from './utils'

export function buildDdl(element) {
  let response = null
  if (isNotEmpty(element)) {
    response = stringFormat(`
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
  const dStr = stringFormat('{0} {1}', [value.name, value.type])
  const endStr = end ? ',\n' : ''
  if (isNotEmpty(value.comment)) {
    column = stringFormat('{0} {1} {2}', [dStr, value.comment, endStr])
  } else {
    column = stringFormat('{0} {1}', [dStr, endStr])
  }
  return column
}
