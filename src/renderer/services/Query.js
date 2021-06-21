import { runExecute } from '@/api/query'
import { stringFormat, getDataSource, getServerURL } from '@/utils/utils'

/**
 * Get Database or table from remote server
 * @param {*} server remote server
 * @param {*} type database or table
 * @param {*} database database name
 * @returns common response
 */
export async function getDatabasesOrTables(server, type, database) {
  const dataSource = getDataSource(server)
  const remoteServer = getServerURL(dataSource[0].host, dataSource[0].port, null)
  const result = {}
  let querySql = null
  switch (type) {
    case 'database':
      querySql = 'SHOW DATABASES'
      break
    case 'table':
      querySql = stringFormat('SELECT name, engine FROM system.tables WHERE database = \'{0}\'', [database])
      break
  }
  await runExecute(remoteServer, querySql).then(response => {
    if (response.status === 200) {
      result.data = response.data.data
      result.status = true
    }
  }).catch(response => {
    result.message = response.data
    result.status = false
  })
  return result
}

export function getQuickSql(quick, database, table) {
  let quickSql = ''
  switch (quick) {
    case 'DESCRIBE':
      quickSql = stringFormat('DESCRIBE {0}.{1}', [database, table])
      break
    case 'LIMIT':
      quickSql = stringFormat('SELECT * FROM {0}.{1} LIMIT 100', [database, table])
      break
    case 'CREATE_TABLE':
      quickSql = stringFormat('SHOW CREATE TABLE {0}.{1}', [database, table])
      break
    case 'SELECT_COUNT':
      quickSql = stringFormat('SELECT COUNT(1) FROM {0}.{1}', [database, table])
      break
  }
  return quickSql
}
