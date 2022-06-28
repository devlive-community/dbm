export interface BaseConfig {
  version: string;
  processesFetchAll: string;
  connectionFetchAll: string;
  slowQueryFetchAll: string;
  databaseFetchAll: string;
  databaseCreate: string;
  schemaFetchAll: string;
  tableFetchAll: string;
  tableSchemaFetchAll: string;
  diskUsedRatio: string;
  databaseDiskUsedRatio: string;
  tableDiskUsedRatio: string;
  columnDiskUsedRatio: string;
  databaseItems: string;
  databaseItemsFilterPrecise: string;
  databaseItemsFilterFuzzy: string;
  tableItems: string;
  tableItemsFilterPrecise: string;
  tableItemsFilterFuzzy: string;
  columnItems: string;
  serverInfo: string;
  stopProcessor: string;
  showCreateDatabase: string;
  showTableWithSize: string;
}
