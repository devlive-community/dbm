import { Injectable } from "@angular/core";
import { BuilderInterface } from "@renderer/interfaces/builder.interface";
import { DatabaseEnum } from "@renderer/enum/database.enum";
import { DesignerColumn } from "@renderer/app/views/object_designer/model/designer.column";
import { StringUtils } from "@renderer/utils/string.utils";
import { SqlUtils } from "@renderer/utils/sql.utils";

@Injectable()
export class ClickhouseBuilder implements BuilderInterface {
  getName(): DatabaseEnum {
    return DatabaseEnum.clickhosue;
  }

  builderCreateDatabase(database: string): string {
    return "";
  }

  builderCreateTable(database: string, table: string, engine: string, columns: DesignerColumn[]): string {
    let sql = StringUtils.format('CREATE TABLE {0} (\n', [SqlUtils.getTableName(database, table)]);
    sql += StringUtils.format('{0}\n', [this.builderColumnsToString(columns)]);
    sql += StringUtils.format(') {0}', [this.builderEngine(engine)]);
    return sql;
  }

  builderDropDatabase(database: string): string {
    return "";
  }

  builderDropTable(database: string, table: string): string {
    return "";
  }

  builderRenameDatabase(source: string, target: string): string {
    return "";
  }

  builderRenameTable(database: string, source: string, target: string): string {
    return "";
  }

  builderColumnsToString(columns: DesignerColumn[]): string {
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

  builderColumnToString(value: DesignerColumn, end: boolean): string {
    let column: string;
    let dStr: string;
    if (value.isNull) {
      dStr = StringUtils.format('    {0} Nullable({1})', [value.name, value.type]);
    } else {
      dStr = StringUtils.format('    {0} {1}', [value.name, value.type]);
    }
    const endStr = end ? ',\n' : '';
    if (StringUtils.isNotEmpty(value.comment)) {
      column = StringUtils.format(`    {0} COMMENT '{1}' {2}`, [dStr, value.comment, endStr]);
    } else {
      column = StringUtils.format('    {0} {1}', [dStr, endStr]);
    }
    return column;
  }

  private builderEngine(engine: string): string {
    return StringUtils.format(' ENGINE = {0}()', [engine]);
  }
}
