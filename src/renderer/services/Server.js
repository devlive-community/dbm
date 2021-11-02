import { getQuery } from './Metadata'

export async function getInfo(server) {
  const sql = 'SELECT * ' +
    'FROM system.build_options'
  return await getQuery(server, sql)
}

/**
 * Gets the version of the specified ClickHouse service and the supported table engine <br/>
 * example: <br/>
 * <code>
 *      21.3.9.83  PostgreSQL
 * </code>
 * @param server Remote clickhouse server
 * @returns {Promise<*>}
 */
export function getVersionAndSupportTableEngine(server) {
  const sql = `
WITH t0 AS (
  SELECT
    version() AS version
),
t1 AS (
  SELECT
    name
  FROM
    "system".table_engines
)
SELECT
  version,
  name
FROM
  t0,
  t1  
`
  return getQuery(server, sql)
}
