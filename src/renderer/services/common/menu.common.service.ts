import { TypeEnum } from "@renderer/enum/type.enum";
import { MenuModel } from "@renderer/model/menu.model";
import { StringUtils } from "@renderer/utils/string.utils";
import { OperationModel } from "@renderer/model/operation.model";
import { OperationEnum } from "@renderer/enum/operation.enum";
import { DatabaseEnum } from "@renderer/enum/database.enum";
import { ConfigModel } from "@renderer/model/config.model";
import { Injectable } from "@angular/core";
import { ClipboardComService } from "@renderer/services/other/clipboard.service";

@Injectable()
export class MenuCommonService {
  constructor(private clipboardComService: ClipboardComService) {
  }

  public applyContextMenu(type: TypeEnum, configure: ConfigModel): MenuModel[] {
    const menus = new Array();
    const operationOfCopy = new OperationModel();
    operationOfCopy.name = StringUtils.format('Copy: {0}', [configure.value]);
    operationOfCopy.type = type;
    operationOfCopy.icon = 'fa-files-o';
    operationOfCopy.operations = [{
      type: type,
      actions: [OperationEnum.copy],
      supportedSource: [DatabaseEnum.clickhosue]
    }];
    menus.push(operationOfCopy);
    return menus;
  }

  public applySqlForOperation(operation: OperationModel, configure: ConfigModel): string {
    let sql;
    switch (operation.operations[0].actions[0]) {
      case OperationEnum.copy:
        this.clipboardComService.copy(configure.value);
        break;
    }
    return sql;
  }
}
