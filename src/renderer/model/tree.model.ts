import { BaseModel } from '@renderer/model/base.model';
import { TypeEnum } from '@renderer/enum/type.enum';

export class TreeModel extends BaseModel {
  title: string;
  key: TreeModel;
  value: string;
  type: TypeEnum;
  isLeaf: boolean;
}
