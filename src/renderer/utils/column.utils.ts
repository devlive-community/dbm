import { ColumnModel } from '@renderer/model/column.model';
import { StringUtils } from '@renderer/utils/string.utils';

export class ColumnUtils {
  static builderColumnsToString(columns: ColumnModel[]): string {
    let columnStr = '';
    columns.forEach((value, index) => {
      if (index !== columns.length - 1) {
        columnStr += this.builderColumnToString(value, true);
      } else {
        columnStr += this.builderColumnToString(value, false);
      }
    });
    return columnStr;
  }

  private static builderColumnToString(value: ColumnModel, end: boolean): string {
    let column: string;
    let dStr: string;
    if (value.empty) {
      dStr = StringUtils.format('    `{0}` Nullable({1})', [value.name, value.type]);
    } else {
      dStr = StringUtils.format('    `{0}` {1}', [value.name, value.type]);
    }
    const endStr = end ? ',\n' : '';
    if (StringUtils.isNotEmpty(value.description)) {
      column = StringUtils.format(`    {0} COMMENT '{1}' {2}`, [dStr, value.description, endStr]);
    } else {
      column = StringUtils.format('    {0} {1}', [dStr, endStr]);
    }
    return column;
  }
}
