import { getQuery } from '@/services/Metadata'

const StringUtils = require('../utils/StringUtils')

export async function getTrackInfo(server, id) {
  const sql = StringUtils.format(`
SELECT
  query_id AS id,
  type AS type,
  event_date AS startTime,
  query_start_time AS queryStartTime,
  query_duration_ms AS "dutation(ms)",
  read_rows AS readRows,
  read_bytes AS readBytes,
  written_rows AS writtenRows,
  written_bytes AS writtenBytes,
  result_rows AS resultRows,
  result_bytes AS resultBytes,
  memory_usage AS memoryUsage,
  query AS ddl,
  exception AS exception,
  stack_trace AS stackTrace,
  user AS user,
  address AS address
FROM
  system.query_log
WHERE
  query_id = '{0}'
ORDER BY
  query_duration_ms DESC
  `, [id])
  return await getQuery(server, sql)
}

export async function getTrackThread(server, id) {
  const sql = StringUtils.format(`
SELECT
  query_id AS id,
  event_date AS startTime,
  query_start_time AS queryStartTime,
  query_duration_ms AS "dutation(ms)",
  read_rows AS readRows,
  read_bytes AS readBytes,
  written_rows AS writtenRows,
  written_bytes AS writtenBytes,
  peak_memory_usage AS peakMemory,
  thread_name AS threadName,
  thread_id AS threadId,
  user AS user,
  address AS address
FROM
  system.query_thread_log
WHERE
  query_id = '{0}'
ORDER BY
  thread_id DESC
  `, [id])
  return await getQuery(server, sql)
}

export function getTrackTop(server, top) {
  if (StringUtils.isEmpty(top)) {
    top = 100
  }
  const sql = StringUtils.format(`
SELECT
  query_id AS value,
  query_start_time AS queryStartTime
FROM
  system.query_log
ORDER BY
  query_start_time DESC
LIMIT
  {0}
  `, [top])
  return getQuery(server, sql)
}
