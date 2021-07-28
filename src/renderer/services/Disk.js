import { getQuery } from '@/services/Metadata'

export async function getDisks(server) {
  const sql = `
SELECT
  name,
  path,
  free_space AS freeBytes,
  total_space AS totalBytes,
  total_space - free_space AS usedBytes,
  keep_free_space AS reservedBytes,
  formatReadableSize(free_space) AS freeSize,
  formatReadableSize(total_space) AS totalSize,
  formatReadableSize(total_space - free_space) AS usedSize,
  formatReadableSize(keep_free_space) AS reservedSize,
  round((total_space - free_space) / total_space * 100, 3) AS value
FROM
  system.disks
  `
  return await getQuery(server, sql)
}
