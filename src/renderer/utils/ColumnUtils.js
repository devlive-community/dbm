const StringUtils = require('./StringUtils')

export function builderAddColumnsDDL(columns) {
  const columnsDDL = []
  if (StringUtils.getLengthGtZone(columns)) {
    columns.forEach(column => {
      columnsDDL.push(builderAddColumnDDL(column))
    })
  }
  return columnsDDL
}

export function builderAddColumnDDL(column) {
  return StringUtils.format('ADD COLUMN {0}', [builderColumnToString(column)])
}

export function builderColumnToString(column) {
  let columnString
  if (StringUtils.isNotEmpty(column)) {
    columnString = column.name
    const columnType = column.empty ? StringUtils.format('Nullable({0})', [column.type]) : column.type
    columnString = StringUtils.format('{0} {1}', [columnString, columnType])
    if (StringUtils.isNotEmpty(column.comment)) {
      columnString = StringUtils.format(`{0} COMMENT '{1}'`, [columnString, column.comment])
    }
  }
  return columnString
}
