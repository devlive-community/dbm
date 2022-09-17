import { DesignerEnum } from "@renderer/app/views/object_designer/enum/designer.enum";
import { DesignerActionEnum } from "@renderer/app/views/object_designer/enum/designer.action";

export class DesignerActionModel {
  type: DesignerEnum = DesignerEnum.column
  action: DesignerActionEnum = DesignerActionEnum.plus;
  icon: string;
  title: string;
}
