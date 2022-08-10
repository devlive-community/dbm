import { BaseConfig } from "@renderer/config/base.config";

export class DruidConfig implements BaseConfig {
  columnAddComment: string;
  columnDiskUsedRatio: string;
  columnItems: string;
  columnRename: string;
  connectionFetchAll: string;
  databaseCreate: string;
  databaseDiskUsedRatio: string;
  databaseFetchAll = `
    SELECT SCHEMA_NAME AS name
    FROM INFORMATION_SCHEMA.SCHEMATA
  `;
  databaseItems: string;
  databaseItemsFilterFuzzy: string;
  databaseItemsFilterPrecise: string;
  diskUsedRatio: string;
  processesFetchAll: string;
  schemaFetchAll: string;
  serverInfo: string;
  showCreateDatabase: string;
  showTableWithSize: string;
  slowQueryFetchAll: string;
  stopProcessor: string;
  tableDiskUsedRatio: string;
  tableFetchAll = `
    SELECT TABLE_NAME AS name
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = '{0}'
  `;
  tableItems: string;
  tableItemsFilterFuzzy: string;
  tableItemsFilterPrecise: string;
  tableSchemaFetchAll: string;
  version = `SELECT '-' AS version`;
  getCharacterAndCollation: string;
  databaseRename: string;
}
