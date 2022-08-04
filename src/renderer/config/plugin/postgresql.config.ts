import { BaseConfig } from "@renderer/config/base.config";

export class PostgresqlConfig implements BaseConfig {
  columnDiskUsedRatio = ``;
  columnItems = `
  SELECT
    table_schema AS "database", table_name AS tableName, column_name AS name,
    data_type AS type
  FROM information_schema.columns
  WHERE table_name = '{0}'
  `;
  connectionFetchAll: string;
  databaseCreate = `CREATE DATABASE {0}`;
  databaseDiskUsedRatio: string;
  databaseFetchAll = `
    SELECT datname AS name
    FROM pg_database
    WHERE datistemplate = false
    GROUP BY datname
  `;
  databaseItems = `
    SELECT datname AS name
    FROM pg_database
    WHERE datistemplate = false
    GROUP BY datname
  `;
  databaseItemsFilterFuzzy = `
    SELECT datname AS name
    FROM pg_database
    WHERE datistemplate = false AND datname LIKE '%{0}%'
    GROUP BY datname
  `;
  databaseItemsFilterPrecise = `
    SELECT datname AS name
    FROM pg_database
    WHERE datistemplate = false AND datname = '{0}'
    GROUP BY datname
  `;
  diskUsedRatio = `
    SELECT
      'default' AS name, '/' AS path,
      SUM(pg_database_size(pg_database.datname)) AS totalBytes,
      pg_size_pretty(SUM(pg_database_size(pg_database.datname))) AS totalSize,
      0 AS value
    FROM pg_database
  `;
  processesFetchAll: string;
  schemaFetchAll: string;
  serverInfo = `
    SELECT name AS name, setting AS value
    FROM pg_catalog.pg_settings
    ORDER BY category
  `;
  slowQueryFetchAll: string;
  tableDiskUsedRatio = `
    SELECT
      table_name AS name,
      pg_total_relation_size('"' || table_schema || '"."' || table_name || '"') AS totalBytes,
      pg_size_pretty(pg_total_relation_size('"' || table_schema || '"."' || table_name || '"')) AS totalSize
    FROM information_schema.tables
    WHERE table_catalog = '{0}'
    ORDER BY table_schema, pg_total_relation_size('"' || table_schema || '"."' || table_name || '"') DESC
  `;
  tableFetchAll = `
    SELECT table_name AS name
    FROM information_schema.tables
    WHERE table_type = 'BASE TABLE'
      AND table_schema = 'public'
  `;
  tableItems = `
--     SELECT table_schema AS "database", TABLE_NAME AS name
--     FROM information_schema.tables
--     WHERE table_catalog = '{0}'
--     AND table_type = 'BASE TABLE'
--     AND table_schema = 'public'
    SELECT table_name AS name
    FROM information_schema.tables
    WHERE table_type = 'BASE TABLE'
    AND table_schema = 'public'
  `;
  tableItemsFilterFuzzy: string;
  tableItemsFilterPrecise: string;
  tableSchemaFetchAll: string;
  version = `SELECT current_setting('server_version') AS version`;
  stopProcessor: string;
  showCreateDatabase: string;
  showTableWithSize = `
    SELECT
      table_name AS name,
      pg_total_relation_size('"' || table_schema || '"."' || table_name || '"') AS totalBytes,
      pg_size_pretty(pg_total_relation_size('"' || table_schema || '"."' || table_name || '"')) AS totalSize
    FROM information_schema.tables
    WHERE table_schema = '{0}'
    ORDER BY table_schema, pg_total_relation_size('"' || table_schema || '"."' || table_name || '"') DESC
  `;
  columnRename: string;
  columnAddComment: string;
}
