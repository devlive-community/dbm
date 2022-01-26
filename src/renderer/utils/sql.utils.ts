import { format } from 'sql-formatter';
import { StringUtils } from './string.utils';

export class SqlUtils {
  static formatter(sql: string, config?: any) {
    return format(sql, config);
  }

  static getTableName(database: string, table: string) {
    return StringUtils.format('`{0}`.`{1}`', [database, table]);
  }
}
