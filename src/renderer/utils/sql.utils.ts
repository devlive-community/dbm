import { format } from 'sql-formatter';

export class SqlUtils {
  static formatter(sql: string, config?: any) {
    return format(sql, config);
  }
}
