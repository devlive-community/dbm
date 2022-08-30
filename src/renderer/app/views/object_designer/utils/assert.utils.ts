import { DesignerApplyData } from "@renderer/app/views/object_designer/model/designer.apply.data";
import { TypeEnum } from "@renderer/enum/type.enum";
import { ActionEnum } from "@renderer/enum/action.enum";

export class AssertUtils {
  public static isCreateTable(applyData: DesignerApplyData): boolean {
    return applyData.type === TypeEnum.database
      && applyData.command.type === TypeEnum.table
      && applyData.command.action === ActionEnum.create;
  }
}
