import { BaseConfig } from '@renderer/config/base.config';

export class ClickhouseConfig implements BaseConfig {
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
  columnItems = `
DESC {0}.{1}
  `;
  serverInfo = `
SELECT * FROM system.build_options
  `;
}
