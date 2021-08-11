import { getQuery } from '@/services/Metadata'
import { stringFormat } from '@/utils/Utils'

export async function deleteTable(server, database, table) {
  const sql = stringFormat('DROP TABLE {0}.{1}', [database, table])
  return await getQuery(server, sql)
}

export async function getTableInfo(server, database, table) {
  const sql = stringFormat('SELECT ' +
    'database, name, uuid, engine, is_temporary, data_paths, metadata_path, metadata_modification_time, dependencies_database, dependencies_table, create_table_query, engine_full, partition_key, sorting_key, primary_key, sampling_key, storage_policy, total_rows, total_bytes, lifetime_rows, lifetime_bytes FROM system.tables ' +
    'WHERE database = \'{0}\' AND name = \'{1}\'', [database, table])
  return await getQuery(server, sql)
}

export async function getTableColumns(server, database, table) {
  const sql = stringFormat('SELECT ' +
    'name, type, position, default_kind, default_expression, data_compressed_bytes, data_uncompressed_bytes, marks_bytes, comment, is_in_partition_key, is_in_sorting_key, is_in_primary_key, is_in_sampling_key, compression_codec ' +
    'FROM system.columns ' +
    'WHERE database = \'{0}\' AND table = \'{1}\'', [database, table])
  return await getQuery(server, sql)
}

export async function getTablePreview(server, database, table) {
  const sql = stringFormat('SELECT * ' +
    'FROM {0}.{1} ' +
    'LIMIT 10', [database, table])
  return await getQuery(server, sql)
}

export function createTable(server, sql) {
  return getQuery(server, sql)
}
