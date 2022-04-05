import { BaseModel } from '@renderer/model/base.model';
import { TypeEnum } from '@renderer/enum/type.enum';
import { MenuModel } from '@renderer/model/menu.model';
import { NzTreeNode } from 'ng-zorro-antd/core/tree/nz-tree-base-node';

export class ConfigModel extends BaseModel {
  title: string;
  key: ConfigModel;
  value: string;
  type: TypeEnum;
  database: string;
  table: string;
  isLeaf: boolean;
  status: boolean;
  menu: MenuModel;
  disabled: boolean;
  currentNode: NzTreeNode;
}
