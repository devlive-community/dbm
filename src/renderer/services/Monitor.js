import { getQuery } from '@/services/Metadata'

/**
 * Get processes from server
 * @param {*} server remote server
 * @returns common response
 */
export async function getProcesses(server) {
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
  return await getQuery(server, querySql)
}

export async function getConnections(server) {
  const querySql = 'SELECT ' +
    'metric, ' +
    'SUM(value) AS value ' +
    'FROM system.metrics ' +
    'WHERE metric LIKE \'%Connection\' ' +
    'GROUP BY metric ' +
    'ORDER BY metric DESC'
  return await getQuery(server, querySql)
}
