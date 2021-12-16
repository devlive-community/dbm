import { BaseModel } from '@renderer/model/base.model';
import { FormatEnum } from '@renderer/enum/format.enum';

export class SystemBasicModel extends BaseModel {
  public network = 10;
  public format: FormatEnum = FormatEnum.JSON;
}
