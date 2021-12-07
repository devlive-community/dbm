import { format } from 'sql-formatter';

export class SqlUtils {
  static formatter(sql: string) {
    return format(sql);
  }
}
