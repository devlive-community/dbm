import { format } from 'sql-formatter';
import { StringUtils } from './string.utils';

export class SqlUtils {
  static formatter(sql: string, config?: any) {
    return format(sql, config);
  }

  static getTableName(database: string, table: string): string {
    return StringUtils.format('`{0}`.`{1}`', [database, table]);
  }

  /**
   * Generates the ALTER table prefix, eg:
   * <p>
   *   ALTER TABLE `default`.`default_table`
   * </p>
   * @param database database
   * @param table table
   */
  static getAlterTablePrefix(database: string, table: string): string {
    return StringUtils.format('ALTER TABLE {0}', [this.getTableName(database, table)]);
  }
}
