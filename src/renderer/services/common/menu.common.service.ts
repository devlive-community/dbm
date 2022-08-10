import { TypeEnum } from "@renderer/enum/type.enum";
import { MenuModel } from "@renderer/model/menu.model";
import { StringUtils } from "@renderer/utils/string.utils";
import { OperationModel } from "@renderer/model/operation.model";
import { OperationEnum } from "@renderer/enum/operation.enum";
import { DatabaseEnum } from "@renderer/enum/database.enum";
import { ConfigModel } from "@renderer/model/config.model";
import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ClipboardComService } from "@renderer/services/other/clipboard.service";
import { SqlUtils } from "@renderer/utils/sql.utils";

@Injectable()
export class MenuCommonService {
  constructor(private clipboardComService: ClipboardComService,
              private translateService: TranslateService) {
  }

  public applyContextMenu(type: TypeEnum, configure: ConfigModel): MenuModel[] {
    const menus = new Array();
    const operationOfCopy = new OperationModel();
    operationOfCopy.name = StringUtils.format(this.translateService.instant('common.copy') + ': {0}', [configure.value]);
    operationOfCopy.type = type;
    operationOfCopy.icon = 'fa-files-o';
    operationOfCopy.operations = [{
      type: type,
      actions: [OperationEnum.copy],
      supportedSource: [DatabaseEnum.clickhosue]
    }];

    switch (type) {
      case TypeEnum.table:
        const operationOfDrop = new OperationModel();
        operationOfDrop.name = StringUtils.format('{0} {1}', [this.translateService.instant('common.delete'), configure.value]);
        operationOfDrop.type = type;
        operationOfDrop.icon = 'fa-trash';
        operationOfDrop.operations = [{
          type: type,
          actions: [OperationEnum.delete],
          supportedSource: [DatabaseEnum.clickhosue]
        }];
        menus.push(operationOfDrop);
        break;
    }

    menus.push(operationOfCopy);
    return menus;
  }

  public applySqlForOperation(operation: OperationModel, configure: ConfigModel): string {
    let sql;
    switch (operation.operations[0].actions[0]) {
      case OperationEnum.copy:
        this.clipboardComService.copy(configure.value);
        break;
      case OperationEnum.delete:
        sql = StringUtils.format('DROP TABLE {0}', [SqlUtils.getTableName(configure.database, configure.value)]);
        break;
    }
    return sql;
  }
}
