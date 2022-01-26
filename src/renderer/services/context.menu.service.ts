import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuModel } from '@renderer/model/menu.model';
import { OperationModel } from '@renderer/model/operation.model';
import { TypeEnum } from '@renderer/enum/type.enum';
import { OperationConfig } from '@renderer/config/operation.config';
import { OperationEnum } from '@renderer/enum/operation.enum';
import { StringUtils } from '@renderer/utils/string.utils';

@Injectable()
export class ContextMenuService {
  commonConfig: OperationModel[];

  constructor(private translateService: TranslateService) {
    this.commonConfig = new OperationConfig().getConfig();
  }

  getContextMenu(type: TypeEnum, configs?: OperationModel[]): MenuModel[] {
    const menus = new Array();
    this.commonConfig.filter(v => v.type === type).forEach(c => {
      c.operations.forEach(op => {
        op.actions.forEach(ac => {
          const menu = new MenuModel();
          menu.type = op.type;
          menu.command = ac;
          menu.icon = this.getIcon(ac);
          const flag = c.type === TypeEnum.disk && ac === OperationEnum.info;
          menu.title = flag ? this.translateService.instant('common.' + ac)
            : StringUtils.format('{0}{1}', [this.translateService.instant('common.' + ac),
            this.translateService.instant('common.' + op.type)]);
          menus.push(menu);
        });
      });
    });
    return menus;
  }

  getIcon(type: OperationEnum): string {
    let icon;
    switch (type) {
      case OperationEnum.info:
        icon = 'info-circle';
        break;
      case OperationEnum.create:
        icon = 'plus-circle';
        break;
      case OperationEnum.delete:
        icon = 'trash';
        break;
      case OperationEnum.rename:
        icon = 'pencil-square';
        break;
      case OperationEnum.truncate:
        icon = 'ambulance';
        break;
      case OperationEnum.clean:
        icon = 'minus-circle';
        break;
        case OperationEnum.optimize:
          icon = 'gavel';
          break;
          case OperationEnum.preview:
            icon = 'eye';
            break;
      default:
        icon = 'info-circle';
    }
    return icon;
  }
}
