import { BaseBuilder } from "@renderer/services/builder/base.builder";
import { DatabaseModel } from "@renderer/model/database.model";
import { ColumnModel } from "@renderer/model/column.model";
import { StringUtils } from "@renderer/utils/string.utils";
import { SqlUtils } from "@renderer/utils/sql.utils";

export class DefaultBuilder implements BaseBuilder {
  builder(configure: DatabaseModel, columns: ColumnModel[]): string {
    let sql = this.builderPrefix(configure);
    sql += this.builderColumns(columns);
    sql += this.builderSuffix();
    return sql;
  }

  builderPrefix(configure: DatabaseModel): string {
    return StringUtils.format('CREATE TABLE {0} (\n',
      [SqlUtils.getTableName(configure.database, configure.targetName)]);
  }

  builderColumns(columns: ColumnModel[]): string {
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

  builderColumnToString(value: ColumnModel, end: boolean): string {
    let column: string;
    let dStr: string;
    if (value.empty) {
      dStr = StringUtils.format('    {0} {1} NOT NULL', [value.name, value.type]);
    } else {
      dStr = StringUtils.format('    {0} {1}', [value.name, value.type]);
    }
    const endStr = end ? ',\n' : '';
    if (StringUtils.isNotEmpty(value.description)) {
      column = StringUtils.format(`    {0} COMMENT '{1}' {2}`, [dStr, value.description, endStr]);
    } else {
      column = StringUtils.format('    {0} {1}', [dStr, endStr]);
    }
    return column;
  }

  builderSuffix(): string {
    return ')';
  }
}
