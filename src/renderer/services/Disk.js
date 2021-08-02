import Response from '@/store/modules/Response'
import { getQuery } from '@/services/Metadata'
import { SERVER, DATABASE } from '@/utils/Support'
import { isNotEmpty, isEmpty } from '@/utils/StringUtils'
import { stringFormat } from '@/utils/utils'

export async function getDiskUsedAndRatio(server, type, database, table) {
  let response = new Response()
  if (type === SERVER) {
    response = await getUsedDisk(server)
  } else if (type === DATABASE && isEmpty(database)) {
    response = await getDbUsedDisk(server)
  } else if (type === DATABASE && isNotEmpty(database)) {
    response = await getTableUsedDisk(server, database)
  }
  return response
}

/**
 * Get server used disk
 * @param server remote server
 * @returns {Promise<*>}
 */
export async function getUsedDisk(server) {
  const sql = `
SELECT
  name,
  path,
  formatReadableSize(free_space) AS freeSize,
  formatReadableSize(total_space) AS totalSize,
  formatReadableSize(total_space - free_space) AS usedSize,
  formatReadableSize(keep_free_space) AS reservedSize,
  round((total_space - free_space) / total_space * 100, 3) AS value
FROM
  system.disks
ORDER BY path DESC
  `
  return await getQuery(server, sql)
}

/**
 * Get database used disk from server
 * @param server remote server
 * @returns {Promise<*>}
 */
export async function getDbUsedDisk(server) {
  const sql = `
WITH t0 AS (
  SELECT
    total_space AS totalBytes,
    total_space - free_space AS usedBytes
  FROM system.disks
),
t1 AS (
  SELECT 
    database, 
    SUM(bytes_on_disk) AS dbUsedBytes
  FROM system.parts
  GROUP BY database
)
SELECT
  t1.database AS name,
  formatReadableSize(t0.totalBytes) AS totalSize,
  formatReadableSize(t0.usedBytes) AS usedSize,
  formatReadableSize(t1.dbUsedBytes) AS dbUsedSize,
  round(t1.dbUsedBytes / t0.totalBytes * 100, 5) AS value
FROM t0, t1
ORDER BY value DESC
  `
  return await getQuery(server, sql)
}

export async function getTableUsedDisk(server, database) {
  let sql = `
WITH t0 AS (
  SELECT
    total_space AS totalBytes,
    total_space - free_space AS usedBytes
  FROM system.disks
),
t1 AS (
  SELECT
    database AS db,
    table AS name,
    SUM(bytes_on_disk) AS tableUsedBytes,
    formatReadableSize(sum(bytes_on_disk)) AS value
  FROM
    system.parts
  GROUP BY db, name
)
SELECT
  format('{0}-{1}', t1.db, t1.name) AS name,
  formatReadableSize(t0.totalBytes) AS totalSize,
  formatReadableSize(t0.usedBytes) AS usedSize,
  formatReadableSize(t1.tableUsedBytes) AS dbUsedSize,
  round(t1.tableUsedBytes / t0.totalBytes * 100, 5) AS value
FROM t0, t1
ORDER BY t1.tableUsedBytes DESC
  `
  if (isNotEmpty(database)) {
    sql = stringFormat(`
WITH t0 AS (
  SELECT
    total_space AS totalBytes,
    total_space - free_space AS usedBytes
  FROM system.disks
),
t1 AS (
  SELECT
    database AS db,
    table AS name,
    SUM(bytes_on_disk) AS tableUsedBytes,
    formatReadableSize(sum(bytes_on_disk)) AS value
  FROM
    system.parts
  WHERE database = '{0}'
  GROUP BY db, name
)
SELECT
  format('{}-{}', t1.db, t1.name) AS name,
  formatReadableSize(t0.totalBytes) AS totalSize,
  formatReadableSize(t0.usedBytes) AS usedSize,
  formatReadableSize(t1.tableUsedBytes) AS dbUsedSize,
  round(t1.tableUsedBytes / t0.totalBytes * 100, 5) AS value
FROM t0, t1
ORDER BY t1.tableUsedBytes DESC
    `, [database])
  }
  return await getQuery(server, sql)
}
