import { getQuery } from '@/services/Metadata'
import { CONNECTIONS, PROCESSES } from '@/utils/Support'

export async function getMonitor(server, type) {
  let response
  switch (type) {
    case CONNECTIONS:
      response = getConnections(server)
      break
    case PROCESSES:
      response = getProcesses(server)
      break
    default:
      response = getMutations(server)
  }
  return response
}

/**
 * Get connections from server
 * @param server remote server
 * @returns {Promise<*>}
 */
export async function getConnections(server) {
  const sql = `
SELECT
  metric,
  SUM(value) AS value
FROM
  system.metrics
WHERE
  metric LIKE '%Connection'
GROUP BY
  metric
ORDER BY
  metric DESC
  `
  return await getQuery(server, sql)
}

/**
 * Get running process from server
 * @param server remote server
 * @returns {Promise<*>}
 */
export async function getProcesses(server) {
  const sql = `
SELECT
  query_id AS id,
  now() AS time,
  query AS query,
  1 AS iCount,
  toUInt64(toUInt64(read_rows) + toUInt64(written_rows)) AS rows,
  round(elapsed, 1) AS elapsed,
  formatReadableSize(toUInt64(read_bytes) + toUInt64(written_bytes)) AS bytes,
  formatReadableSize(memory_usage) AS memoryUsage,
  formatReadableSize(read_bytes) AS bytesRead,
  formatReadableSize(written_bytes) AS bytesWritten,
  cityHash64(query) AS hash,
  hostName() AS host
FROM
  system.processes
WHERE
  round(elapsed, 1) > 0
  `
  return await getQuery(server, sql)
}

export async function getMutations(server) {
  const sql = `
SELECT
  database,
  table,
  mutation_id AS id,
  command AS query,
  create_time AS createTime,
  now() - create_time AS "elapsedTime(ms)"
FROM
  system.mutations
WHERE is_done = 0
  `
  return await getQuery(server, sql)
}

export function getQueryCount(server) {
  const sql = `
SELECT
  cast(COUNT(DISTINCT query_id) AS INT) AS value,
  event_date AS categories
FROM
  system.query_log
GROUP BY
  event_date
ORDER BY
  event_date DESC
LIMIT 100
  `
  return getQuery(server, sql)
}
