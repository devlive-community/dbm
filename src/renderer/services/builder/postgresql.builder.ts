import { BaseBuilder } from "@renderer/services/builder/base.builder";
import { DatabaseModel } from "@renderer/model/database.model";
import { ColumnModel } from "@renderer/model/column.model";
import { StringUtils } from "@renderer/utils/string.utils";

export class PostgresqlBuilder extends BaseBuilder {
  builder(configure: DatabaseModel, columns: ColumnModel[]): string {
    let sql = this.builderPrefix(configure);
    sql += this.builderColumns(columns);
    sql += this.builderSuffix();
    return sql;
  }

  builderPrefix(configure: DatabaseModel): string {
    return StringUtils.format('CREATE TABLE {0} (\n', [configure.targetName]);
  }
}
