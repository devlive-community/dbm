import { BaseConfig } from "@renderer/config/base.config";

export class PrestoConfig implements BaseConfig {
  getCharacterAndCollation: string;
  version = `
    SELECT node_version AS version
    FROM system.runtime.nodes LIMIT 1
  `;
  processesFetchAll = `
    SELECT query_id AS id,
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
    SELECT source AS categories,
           COUNT(1) AS value
    FROM system.runtime.queries
    WHERE state = 'RUNNING'
    GROUP BY source
    ORDER BY source DESC
  `;
  slowQueryFetchAll = `
    SELECT query_id AS id,
           now() AS time, query AS query, '0' AS rows,
  (analysis_time_ms + planning_time_ms + queued_time_ms) AS elapsed,
  '0' AS bytes, '0' AS memoryUsage,
  '0' AS bytesRead, '0' AS bytesWritten,
  '' AS hash, '' AS host
    FROM system.runtime.queries
    WHERE (analysis_time_ms + planning_time_ms + queued_time_ms) >= {0}
    ORDER BY (analysis_time_ms + planning_time_ms + queued_time_ms) DESC
      LIMIT 100
  `;
  databaseFetchAll = `SHOW CATALOGS`;
  databaseCreate = `CREATE SCHEMA {0}`;
  schemaFetchAll = 'SHOW SCHEMAS FROM {0}';
  tableFetchAll = 'SHOW TABLES FROM {0}.{1}';
  tableSchemaFetchAll = `SELECT table_name AS name
                         FROM {0}.information_schema.tables
                         WHERE table_schema='{1}'`;
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
  serverInfo = this.version;
  stopProcessor = `CALL system.runtime.kill_query(query_id => '{0}', message => 'Use dbm client kill {0} this query')`;
  showCreateDatabase: string;
  showTableWithSize: string;
  columnRename: string;
  columnAddComment: string;
}
