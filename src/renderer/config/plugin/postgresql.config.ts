import { BaseConfig } from "@renderer/config/base.config";

export class PostgresqlConfig implements BaseConfig {
  columnDiskUsedRatio: string;
  columnItems: string;
  connectionFetchAll: string;
  databaseCreate: string;
  databaseDiskUsedRatio: string;
  databaseFetchAll = `
    SELECT datname AS name
    FROM pg_database
    WHERE datistemplate = false
    GROUP BY datname
  `;
  databaseItems: string;
  databaseItemsFilterFuzzy: string;
  databaseItemsFilterPrecise: string;
  diskUsedRatio: string;
  processesFetchAll: string;
  schemaFetchAll: string;
  serverInfo: string;
  slowQueryFetchAll: string;
  tableDiskUsedRatio: string;
  tableFetchAll = `
    SELECT table_name AS name
    FROM information_schema.tables
    WHERE table_type = 'BASE TABLE'
    AND table_schema = 'public'
  `;
  tableItems: string;
  tableItemsFilterFuzzy: string;
  tableItemsFilterPrecise: string;
  tableSchemaFetchAll: string;
  version = `SELECT current_setting('server_version') AS version`;
  stopProcessor: string;
  showCreateDatabase: string;
  showTableWithSize: string;
  columnRename: string;
}
