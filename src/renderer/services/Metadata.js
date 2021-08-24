import { getAuthenticationResponse } from '@/services/Common'
import Authentication from '@/store/modules/Authentication'

const Support = require('../utils/Support')
const StringUtils = require('../utils/StringUtils')

export async function getQuery(server, query) {
  const configuration = new Authentication()
  configuration.server = server
  return await getAuthenticationResponse(configuration, query)
}

export async function getDataByParam(server, type, database, table) {
  let sql = 'SHOW DATABASES'
  switch (type) {
    case Support.DATABASE:
      return await getQuery(server, sql)
    case Support.TABLE:
      sql = StringUtils.format(`
            SELECT uuid, name, engine, partition_key, sorting_key, total_rows, total_bytes
            FROM system.tables
            WHERE database = '{0}'
            `, [database])
      return await getQuery(server, sql)
    case Support.COLUMN:
      // Do not use the `SELECT. FROM system.columns` table, otherwise the data will not be queried
      sql = StringUtils.format(`DESC {0}.{1}`, [database, table])
      return await getQuery(server, sql)
  }
}
