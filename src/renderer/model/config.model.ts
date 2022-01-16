import { BaseModel } from '@renderer/model/base.model';
import { TypeEnum } from '@renderer/enum/type.enum';

export class ConfigModel extends BaseModel {
  title: string;
  key: ConfigModel;
  value: string;
  type: TypeEnum;
  database: string;
  table: string;
  isLeaf: boolean;
}
