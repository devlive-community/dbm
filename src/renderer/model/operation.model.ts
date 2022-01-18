import { OperationEnum } from '@renderer/enum/operation.enum';
import { TypeEnum } from '@renderer/enum/type.enum';

export class OperationModel {
  name: string;
  type: TypeEnum;
  operations: { type: TypeEnum; actions: OperationEnum[] }[];
}
