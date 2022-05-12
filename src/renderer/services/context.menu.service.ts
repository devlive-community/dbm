import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuModel } from '@renderer/model/menu.model';
import { OperationModel, OperationNodeModel } from '@renderer/model/operation.model';
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
    this.commonConfig.filter(v => v.type === type).forEach(operation => {
      operation.operations.forEach(operationNode => {
        operationNode.actions.forEach(action => {
          const menu = this.getMenu(operation, operationNode, action);
          if (operationNode?.children) {
            menu['children'] = new Array();
            operationNode.children.forEach(operationNodeChild => {
              menu['children'].push(this.getMenu(operation, operationNodeChild, operationNodeChild.actions[0]));
            });
          }
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
      case OperationEnum.ttl_remove:
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
      case OperationEnum.ttl:
        icon = 'tty';
        break;
      case OperationEnum.ttl_modify:
        icon = 'pencil-square-o';
        break;
      case OperationEnum.filter:
        icon = 'filter';
        break;
      default:
        icon = 'info-circle';
    }
    return icon;
  }

  getMenu(operation: OperationModel, operationNode: OperationNodeModel, action: OperationEnum): MenuModel {
    const menu = new MenuModel();
    menu.type = operationNode.type;
    menu.command = action;
    menu.icon = this.getIcon(action);
    const flag = operation.type === TypeEnum.disk && action === OperationEnum.info;
    const operationArray = action.toString().split('_');
    if (operationArray.length > 1) {
      menu.title = flag ? this.translateService.instant('common.' + action)
        : StringUtils.format('{0}{1}', [this.translateService.instant('common.' + operationArray[0]),
          this.translateService.instant('common.' + operationArray[1])]);
    } else {
      menu.title = flag ? this.translateService.instant('common.' + action)
        : StringUtils.format('{0}{1}', [this.translateService.instant('common.' + action),
          this.translateService.instant('common.' + operationNode.type)]);
    }
    return menu;
  }
}
