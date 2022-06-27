import { DatabaseModel } from "@renderer/model/database.model";
import { ColumnModel } from "@renderer/model/column.model";

export interface BaseBuilder {
  builder(configure: DatabaseModel, columns: ColumnModel[]): string;
}
