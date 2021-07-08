import { runExecute } from '@/api/query'
import { getServerURL, getDataSource } from '@/utils/Utils'
import Response from '@/store/modules/Response'

/**
 * Get processes from server
 * @param {*} server remote server
 * @returns common response
 */
export async function getProcesses(server) {
  const dataSource = getDataSource(server)
  const remoteServer = getServerURL(dataSource[0].host, dataSource[0].port, null)
  const result = new Response()
  const querySql = 'SELECT ' +
    'query_id AS id, ' +
    'now() AS time, ' +
    'query AS query, ' +
    '1 AS iCount, ' +
    'toUInt64(toUInt64(read_rows) + toUInt64(written_rows)) AS rows, ' +
    'round(elapsed, 1) AS elapsed, ' +
    'formatReadableSize(toUInt64(read_bytes) + toUInt64(written_bytes)) AS bytes, ' +
    'formatReadableSize(memory_usage) AS memoryUsage, ' +
    'formatReadableSize(read_bytes) AS bytesRead, ' +
    'formatReadableSize(written_bytes) AS bytesWritten, ' +
    'cityHash64(query) AS hash, ' +
    'hostName() AS host ' +
    'FROM system.processes ' +
    'WHERE round(elapsed,1) > 0'
  await runExecute(remoteServer, querySql).then(response => {
    if (response.status === 200) {
      result.columns = response.data.data
      result.status = true
    }
  }).catch(response => {
    result.message = response.data
    result.status = false
  })
  return result
}
