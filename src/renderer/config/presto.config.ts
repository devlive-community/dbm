import {BaseConfig} from "@renderer/config/base.config";

export class PrestoConfig implements BaseConfig {
  version = `
SELECT node_version AS version
FROM system.runtime.nodes
LIMIT 1
  `;
  processesFetchAll = `
SELECT
  query_id AS id,
  now() AS time,
  query AS query,
  '0' AS rows,
  analysis_time_ms + planning_time_ms + queued_time_ms AS elapsed,
  '0' AS bytes,
  '0' AS memoryUsage,
  '0' AS bytesRead,
  '0' AS bytesWritten,
  '' AS hash,
  '' AS host
FROM
  system.runtime.queries
WHERE
  state = 'RUNNING'
`;
  connectionFetchAll = `
SELECT
  source AS categories,
  COUNT(1) AS value
FROM system.runtime.queries
WHERE state = 'RUNNING'
GROUP BY source
ORDER BY source DESC
`;
  columnDiskUsedRatio: string;
  columnItems: string;
  databaseDiskUsedRatio: string;
  databaseItems: string;
  databaseItemsFilterFuzzy: string;
  databaseItemsFilterPrecise: string;
  diskUsedRatio: string;
  tableDiskUsedRatio: string;
  tableItems: string;
  tableItemsFilterFuzzy: string;
  tableItemsFilterPrecise: string;
}
