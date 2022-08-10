import { BaseBuilder } from "@renderer/services/builder/base.builder";
import { DatabaseModel } from "@renderer/model/database.model";
import { ColumnModel } from "@renderer/model/column.model";

export class DefaultBuilder extends BaseBuilder {
  builder(configure: DatabaseModel, columns: ColumnModel[]): string {
    let sql = this.builderPrefix(configure);
    sql += this.builderColumns(columns);
    sql += this.builderSuffix();
    return sql;
  }
}
