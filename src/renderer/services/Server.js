import { getQuery } from '@/services/Metadata'

export async function getInfo(server) {
  const sql = 'SELECT * ' +
    'FROM system.build_options'
  return await getQuery(server, sql)
}
