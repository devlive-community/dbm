import { getQuery } from '@/services/Metadata'

const StringUtils = require('../utils/StringUtils')
const DatabaseUtils = require('../utils/DatabaseUtils')

/**
 * Gets the total number of tables owned by the remote server database
 * @param {*} server remote server
 * @param {*} source database name
 */
export async function getTableSize(server, value) {
  const sql = StringUtils.format('SELECT ' +
    'count() AS iCount ' +
    'FROM system.tables ' +
    'WHERE database = \'{0}\'', [value])
  return await getQuery(server, sql)
}

export function addDataBase(server, value) {
  const sql = DatabaseUtils.builderDatabaseDDL(value)
  return getQuery(server, sql)
}

/**
 * Delete database from remote server
 * @param {*} server remote server
 * @param {*} source database name
 * @returns Response
 */
export async function deleteDatabase(server, value) {
  const tableSizeResult = await getTableSize(server, value)
  let result = {}
  if (value === 'system') {
    result.message = 'Not Support system database'
  } else if (tableSizeResult.statistics.rows_read > 0) {
    // TODO: delete all table?
    result.message = 'It is not supported to delete the database with tables in the library!'
  } else {
    const sql = StringUtils.format('DROP DATABASE {0}', [value])
    result = await getQuery(server, sql)
  }
  return result
}

export function getDatabase(server, value) {
  const sql = StringUtils.format(`
SELECT
  name,
  "engine",
  uuid
FROM
  "system"."databases"
WHERE
  name = '{0}'
  `, [value])
  return getQuery(server, sql)
}
