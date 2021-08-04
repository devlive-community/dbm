import { getQuery } from '@/services/Metadata'
import { stringFormat } from '@/utils/Utils'

export async function getTrackInfo(server, id) {
  const sql = stringFormat(`
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
