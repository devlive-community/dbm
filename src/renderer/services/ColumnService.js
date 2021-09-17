import { getQuery } from './Metadata'

const StringUtils = require('../utils/StringUtils')
const ColumnUtils = require('../utils/ColumnUtils')

export async function addColumns(configure, columns) {
  const sql = StringUtils.format('ALTER TABLE {0}.{1} {2}',
    [configure.database, configure.table, ColumnUtils.builderAddColumnDDL(columns)])
  return getQuery(configure.server, sql)
}

export function deleteColumn(configure) {
  const sql = StringUtils.format('ALTER TABLE {0}.{1} DROP COLUMN {2}',
    [configure.database, configure.table, configure.column])
  return getQuery(configure.server, sql)
}

export function modifyColumn(configure, column) {
  const sql = StringUtils.format('ALTER TABLE {0}.{1} MODIFY COLUMN {2}',
    [configure.database, configure.table, ColumnUtils.builderColumnToString(column)])
  return getQuery(configure.server, sql)
}
