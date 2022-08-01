import { BaseConfig } from "@renderer/config/base.config";

export class ElasticsearchConfig implements BaseConfig {
  columnAddComment: string;
  columnDiskUsedRatio: string;
  columnItems: string;
  columnRename: string;
  connectionFetchAll: string;
  databaseCreate: string;
  databaseDiskUsedRatio: string;
  databaseFetchAll: string;
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
  tableFetchAll: string;
  tableItems: string;
  tableItemsFilterFuzzy: string;
  tableItemsFilterPrecise: string;
  tableSchemaFetchAll: string;
  version = `SELECT 1 AS version`;
}
