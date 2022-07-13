import { OperationEnum } from '@renderer/enum/operation.enum';
import { TypeEnum } from '@renderer/enum/type.enum';
import { DatabaseEnum } from "@renderer/enum/database.enum";

export class OperationModel {
  name: string;
  type: TypeEnum;
  operations: OperationNodeModel[];
  icon?: string;
}

export class OperationNodeModel {
  type: TypeEnum;
  actions: OperationEnum[];
  children?: OperationNodeModel[];
  supportedSource?: DatabaseEnum[] = [DatabaseEnum.clickhosue];
  icon?: string;
}
