import { runExecute } from '@/api/query'
import { stringFormat, getDataSource, getServerURL } from '@/utils/utils'

/**
 * Delete database from remote server
 * @param {*} server remote server
 * @param {*} source database name
 * @returns Response
 */
export async function deleteDatabase(server, source) {
  const tableSizeResult = await getTableSize(server, source)
  const result = {}
  result.status = false
  if (source === 'system') {
    result.message = 'Not Support system database'
  } else if (tableSizeResult.data > 0) {
    // TODO: delete all table?
    result.message = 'It is not supported to delete the database with tables in the library!'
  } else {
    const dataSource = getDataSource(server)
    const remoteServer = getServerURL(dataSource[0].host, dataSource[0].port, null)
    const sql = stringFormat('DROP DATABASE {0}', [source])
    await runExecute(remoteServer, sql).then(response => {
      if (response.status === 200) {
        result.message = stringFormat('Delete Database <{0}> Operation successful!', [source])
        result.status = true
      }
    }).catch(response => {
      result.message = response.data
      result.status = false
    })
  }
  return result
}

/**
 * Gets the total number of tables owned by the remote server database
 * @param {*} server remote server
 * @param {*} source database name
 */
export async function getTableSize(server, source) {
  const dataSource = getDataSource(server)
  const remoteServer = getServerURL(dataSource[0].host, dataSource[0].port, null)
  const result = {}
  const sql = stringFormat('SELECT count() AS iCount FROM system.tables WHERE database = \'{0}\'', [source])
  await runExecute(remoteServer, sql).then(response => {
    if (response.status === 200) {
      result.data = response.data.statistics.rows_read
      result.status = true
    }
  }).catch(response => {
    result.message = response.data
    result.status = false
  })
  return result
}
