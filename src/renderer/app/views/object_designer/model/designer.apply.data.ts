import { DatasourceModel } from "@renderer/model/datasource.model";
import { TypeEnum } from "@renderer/enum/type.enum";
import { ActionEnum } from "@renderer/enum/action.enum";

export class DesignerApplyData {
  dataSource: DatasourceModel = new DatasourceModel(); // The currently selected data source instance
  database: string;
  table: string;
  engine: string = 'Memory';
  isOpen: boolean = false; // Whether the current node is enabled
  type: TypeEnum; // Current node type
  command: { type: TypeEnum, action: ActionEnum } = {type: TypeEnum.none, action: ActionEnum.none};
  currentValue: string;
  reload: boolean = false;
  width: number;
  height: number;

  resetCommand(applyData: DesignerApplyData) {
    applyData.command = {type: TypeEnum.none, action: ActionEnum.none}
  }
}
