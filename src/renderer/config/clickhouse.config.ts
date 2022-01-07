import { BaseConfig } from '@renderer/config/base.config';

export class ClickhouseConfig implements BaseConfig {
  diskUsed = `
SELECT
    name, path, formatReadableSize(free_space) AS freeSize, formatReadableSize(total_space) AS totalSize,
    formatReadableSize(total_space - free_space) AS usedSize, formatReadableSize(keep_free_space) AS reservedSize,
    round((total_space - free_space) / total_space * 100, 3) AS value
FROM system.disks
ORDER BY path DESC
  `;
  databaseUsed = `
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
}
