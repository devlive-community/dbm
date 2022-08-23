import { DatasourceModel } from "@renderer/model/datasource.model";
import { TypeEnum } from "@renderer/enum/type.enum";

export class DesignerApplyData {
  dataSource: DatasourceModel = new DatasourceModel(); // The currently selected data source instance
  database: string;
  isOpen: boolean = false; // Whether the current node is enabled
  type: TypeEnum; // Current node type
  currentValue: string;
  width: number;
  height: number;
}
