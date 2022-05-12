import { BaseModel } from '@renderer/model/base.model';
import { TypeEnum } from '@renderer/enum/type.enum';
import { MenuModel } from '@renderer/model/menu.model';
import { NzTreeNode } from 'ng-zorro-antd/core/tree/nz-tree-base-node';
import { FilterModel } from '@renderer/model/filter.model';

export class ConfigModel extends BaseModel {
  title: string;
  key: any;
  value: string;
  type: TypeEnum;
  database: string;
  table: string;
  isLeaf: boolean;
  status: boolean;
  filter: FilterModel;
  menu: MenuModel;
  disabled: boolean;
  currentNode: NzTreeNode;
}
