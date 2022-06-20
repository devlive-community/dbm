import { BaseConfig } from "@renderer/config/base.config";

export class MySQLConfig implements BaseConfig {
  columnDiskUsedRatio: string;
  columnItems: string;
  connectionFetchAll: string;
  databaseCreate: string;
  databaseDiskUsedRatio: string;
  databaseFetchAll = `
SELECT schema_name AS name
FROM information_schema.schemata
`;
  databaseItems: string;
  databaseItemsFilterFuzzy: string;
  databaseItemsFilterPrecise: string;
  diskUsedRatio: string;
  processesFetchAll = `
SELECT
    id, now() AS time, info AS query, time AS elapsed,
    db, host, user, state, command
FROM information_schema.PROCESSLIST
`;
  schemaFetchAll: string;
  serverInfo: string;
  slowQueryFetchAll: string;
  tableDiskUsedRatio: string;
  tableFetchAll = `
SELECT table_name AS name
FROM information_schema.tables
WHERE table_schema = '{0}'
  `;
  tableItems: string;
  tableItemsFilterFuzzy: string;
  tableItemsFilterPrecise: string;
  tableSchemaFetchAll: string;
  version = `SELECT version() AS version`;
}
