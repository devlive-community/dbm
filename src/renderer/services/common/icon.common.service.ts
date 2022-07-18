import { TypeEnum } from "@renderer/enum/type.enum";

export class IconCommonService {
  public applyIcon(type: TypeEnum): string {
    let icon;
    switch (type) {
      case TypeEnum.database:
        icon = 'database';
        break
      case TypeEnum.table:
        icon = 'table';
        break;
      case TypeEnum.column:
        icon = 'columns';
        break;
    }
    return icon;
  }
}
