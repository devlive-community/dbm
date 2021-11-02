import { getQuery } from '@/services/Metadata'

const Support = require('../utils/Support')
const StringUtils = require('../utils/StringUtils')

export async function getMonitor(server, type) {
  let response
  switch (type) {
    case Support.CONNECTIONS:
      response = getConnections(server)
      break
    case Support.PROCESSES:
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

export function getSlowQuery(server, threshold) {
  const sql = StringUtils.format(`
SELECT 
    user, 
    client_hostname AS host, 
    client_name AS hash, 
    query_start_time AS time, 
    query_duration_ms AS elapsed, 
    round(memory_usage / 1048576) AS memoryUsage, 
    result_rows AS rows, 
    result_bytes / 1048576 AS bytes, 
    read_rows AS readRows, 
    round(read_bytes / 1048576) AS bytesRead, 
    written_rows AS writtenRows, 
    round(written_bytes / 1048576) AS bytesWritten
FROM system.query_log
WHERE type = 2
AND query_duration_ms >= {0}
ORDER BY query_duration_ms DESC
LIMIT 100
  `, [threshold])
  return getQuery(server, sql)
}
