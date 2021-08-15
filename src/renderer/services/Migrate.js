import { stringFormat } from '../utils/utils'
import { getDataSource } from './DataSource'
import { isEmpty } from '../utils/StringUtils'
import { checkTableExists } from './Table'
import { getQuery } from './Metadata'

export async function migrate(source, target) {
  let response
  let targetDatabase = target.database.value
  let targetTable = target.table.value
  if (isEmpty(targetDatabase)) {
    targetDatabase = source.database.value
  }
  if (isEmpty(targetTable)) {
    targetTable = source.table.value
  }
  // step 1: check table from target server
  let tableExists = false
  const cr = await checkTableExists(target.server, targetDatabase, targetTable)
  if (cr && cr.status) {
    if (cr.columns.length > 0) {
      tableExists = true
    }
  }
  // step 2: get table ddl to source server
  let tableDdl
  const sql = stringFormat(`SHOW CREATE TABLE {0}.{1}`, [source.database.value, source.table.value])
  const gr = await getQuery(source.server, sql)
  if (gr && gr.status) {
    if (gr.columns.length > 0) {
      tableDdl = gr.columns[0].statement
    }
  }
  // step 3: replace table name
  if (tableDdl) {
    tableDdl = tableDdl.replace(stringFormat('{0}.{1}', [source.database.value, source.table.value]),
      stringFormat('{0}.{1}', [targetDatabase, targetTable]))
  }
  // step 4: create table on target server
  let tableCreate = false
  if (!tableExists) {
    const gqr = await getQuery(source.server, tableDdl)
    if (gqr && gqr.status) {
      tableCreate = true
    }
  }
  // step 5: migrate data
  if ((tableExists && !tableCreate) || (!tableExists && tableCreate)) {
    const sSource = getDataSource(source.server)[0]
    const sql = builderDDL(source, target, targetDatabase, targetTable, sSource)
    response = await getQuery(target.server, sql)
  }
  return response
}

export function builderDDL(source, target, targetDatabase, targetTable, sSource) {
  const sql = stringFormat(`
INSERT INTO {0}
SELECT * FROM remote('{1}', {2}, {3}, '{4}', '{5}')
  `, [
    stringFormat('{0}.{1}', [targetDatabase, targetTable]),
    sSource.host,
    source.database.value,
    source.table.value,
    sSource.username,
    sSource.password])
  return sql
}
