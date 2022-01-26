import { TypeEnum } from '@renderer/enum/type.enum';
import { OperationEnum } from '@renderer/enum/operation.enum';

export class MenuModel {
  title: string;
  command: OperationEnum;
  type: TypeEnum;
  icon: string;
}
