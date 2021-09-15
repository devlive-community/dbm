import { getQuery } from './Metadata'
import { builderAddColumnDDL } from '../utils/ColumnUtils'

const StringUtils = require('../utils/StringUtils')

export async function addColumns(configure, columns) {
  const sql = StringUtils.format('ALTER TABLE {0}.{1} {2}',
    [configure.database, configure.table, builderAddColumnDDL(columns)])
  return getQuery(configure.server, sql)
}

export function deleteColumn(configure) {
  const sql = StringUtils.format('ALTER TABLE {0}.{1} DROP COLUMN {2}',
    [configure.database, configure.table, configure.column])
  return getQuery(configure.server, sql)
}
