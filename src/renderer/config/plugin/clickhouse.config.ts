import {BaseConfig} from '@renderer/config/base.config';

export class ClickhouseConfig implements BaseConfig {
  version = `
SELECT version() AS version
`;
  processesFetchAll = `
SELECT
  query_id AS id,
  now() AS time,
  query AS query,
  toUInt64(toUInt64(read_rows) + toUInt64(written_rows)) AS rows,
  round(elapsed, 1) AS elapsed,
  formatReadableSize(toUInt64(read_bytes) + toUInt64(written_bytes)) AS bytes,
  formatReadableSize(memory_usage) AS memoryUsage,
  formatReadableSize(read_bytes) AS bytesRead,
  formatReadableSize(written_bytes) AS bytesWritten,
  cityHash64(query) AS hash,
  hostName() AS host
FROM
  system.processes
WHERE
  round(elapsed, 1) > 0
  `;
  slowQueryFetchAll = `
SELECT
    user, client_hostname AS host,
    client_name AS hash, query AS query,
    query_start_time AS time, query_duration_ms AS elapsed,
    round(memory_usage / 1048576) AS memoryUsage,
    result_rows AS rows, result_bytes / 1048576 AS bytes,
    read_rows AS readRows, round(read_bytes / 1048576) AS bytesRead,
    written_rows AS writtenRows, round(written_bytes / 1048576) AS bytesWritten
FROM system.query_log
WHERE type = 2
AND query_duration_ms >= {0}
ORDER BY query_duration_ms DESC
LIMIT 100
  `;
  connectionFetchAll = `
SELECT
  metric AS categories,
  toUInt32(SUM(value)) AS value
FROM system.metrics
WHERE metric LIKE '%Connection'
GROUP BY metric
ORDER BY metric DESC
  `;
  databaseFetchAll = `SHOW DATABASES`;
  databaseCreate = `CREATE DATABASE {0}`;
  schemaFetchAll: string;
  tableFetchAll = `SHOW TABLES FROM {0}`;
  tableSchemaFetchAll = ``;
  diskUsedRatio = `
SELECT
    name, path, formatReadableSize(free_space) AS freeSize, formatReadableSize(total_space) AS totalSize,
    formatReadableSize(total_space - free_space) AS usedSize, formatReadableSize(keep_free_space) AS reservedSize,
    round((total_space - free_space) / total_space * 100, 3) AS value
FROM system.disks
ORDER BY path DESC
  `;
  databaseDiskUsedRatio = `
WITH t0 AS (
  SELECT total_space AS totalBytes, total_space - free_space AS usedBytes
  FROM system.disks
),
t1 AS (
  SELECT database, SUM(bytes_on_disk) AS dbUsedBytes
  FROM system.parts
  GROUP BY database
)
SELECT
  t1.database AS name, formatReadableSize(t0.totalBytes) AS totalSize, formatReadableSize(t0.usedBytes) AS usedSize,
  formatReadableSize(t1.dbUsedBytes) AS dbUsedSize, round(t1.dbUsedBytes / t0.totalBytes * 100, 3) AS value
FROM t0, t1
ORDER BY value DESC
  `;
  tableDiskUsedRatio = `
WITH t0 AS (
  SELECT total_space AS totalBytes, total_space - free_space AS usedBytes
  FROM system.disks
),
t1 AS (
  SELECT
    database AS db, table AS name, SUM(bytes_on_disk) AS tableUsedBytes,
    formatReadableSize(sum(bytes_on_disk)) AS value
  FROM system.parts
  WHERE database = '{0}'
  GROUP BY db, name
)
SELECT
    format('{}-{}', t1.db, t1.name) AS name, formatReadableSize(t0.totalBytes) AS totalSize,
    formatReadableSize(t0.usedBytes) AS usedSize, formatReadableSize(t1.tableUsedBytes) AS dbUsedSize,
    round(t1.tableUsedBytes / t0.totalBytes * 100, 5) AS value
FROM t0, t1
ORDER BY t1.tableUsedBytes DESC
  `;
  columnDiskUsedRatio = `
WITH t0 AS (
  SELECT total_space AS totalBytes, total_space - free_space AS usedBytes
  FROM system.disks
),
t1 AS (
  SELECT
    database AS db, column AS name, table,
    SUM(column_data_compressed_bytes) AS columnCompressedUsedBytes,
    SUM(column_data_uncompressed_bytes) AS columnUncompressedUsedBytes,
    formatReadableSize(SUM(column_data_compressed_bytes)) AS value
  FROM system.parts_columns
  WHERE database = '{0}' AND table = '{1}'
  GROUP BY db, table, name
)
SELECT
    format('{}-{}', t1.table, t1.name) AS name, formatReadableSize(t0.totalBytes) AS totalSize,
    formatReadableSize(t0.usedBytes) AS usedSize,
    formatReadableSize(t1.columnCompressedUsedBytes) AS columnCompressedUsedSize,
    formatReadableSize(t1.columnCompressedUsedBytes) AS columnUncompressedUsedSize,
    round(t1.columnCompressedUsedBytes / t0.totalBytes * 100, 5) AS value
FROM t0, t1
ORDER BY t1.columnCompressedUsedBytes DESC
LIMIT {2}
  `;
  databaseItems = `
SELECT name, engine AS value
FROM "system".databases
  `;
  databaseItemsFilterPrecise = `
SELECT name, engine AS value
FROM "system".databases
WHERE name = '{0}'
`;
  databaseItemsFilterFuzzy = `
SELECT name, engine AS value
FROM "system".databases
WHERE name LIKE '%{0}%'
`;
  tableItems = `
SELECT uuid, name, engine AS value, partition_key, sorting_key, total_rows, total_bytes, database
FROM system.tables
WHERE database = '{0}'
  `;
  tableItemsFilterPrecise = `
SELECT uuid, name, engine AS value, partition_key, sorting_key, total_rows, total_bytes, database
FROM system.tables
WHERE database = '{0}'
AND name = '{1}'
  `;
  tableItemsFilterFuzzy = `
SELECT uuid, name, engine AS value, partition_key, sorting_key, total_rows, total_bytes, database
FROM system.tables
WHERE database = '{0}'
AND name LIKE '%{1}%'
  `;
  columnItems = `
DESC {0}.{1}
  `;
  serverInfo = `
SELECT * FROM system.build_options
  `;
  stopProcessor = `KILL QUERY WHERE query_id = '{0}'`;
  showCreateDatabase = 'SHOW CREATE DATABASE `{0}`';
  showTableWithSize = `
SELECT name, engine, total_rows AS totalRows,
       formatReadableSize(total_bytes) AS totalSize
FROM system.tables
WHERE database = '{0}'
  `;
  columnRename = `
ALTER TABLE {0} RENAME COLUMN {1} TO {2}
  `;
  columnAddComment = `
ALTER TABLE {0} COMMENT COLUMN {1} '{2}'
  `;
  getCharacterAndCollation: string;
  databaseRename = 'RENAME DATABASE `{0}` TO `{1}`';
  /* Metadata management related SQL */
  metadataManagementFetchTables = `
  SELECT
    name AS tableName, total_rows AS tableTotalRows, formatReadableSize(total_bytes) AS tableTotalSize,
    engine AS tableEngine, metadata_modification_time AS tableModificationTime
    -- , create_table_query AS tableContent
  FROM system.tables
  WHERE database = '{0}'
  `
  metadataManagementFetchTableData = "SELECT * FROM `{0}`.`{1}` LIMIT {2}, {3}"
}
