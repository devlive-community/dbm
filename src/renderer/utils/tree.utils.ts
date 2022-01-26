import { ConfigModel } from '@renderer/model/config.model';
import { StringUtils } from '@renderer/utils/string.utils';
import { NzTreeNode } from 'ng-zorro-antd/core/tree/nz-tree-base-node';

export class TreeUtils {
  public static builderTreeNode(array, type): ConfigModel[] {
    const elements = new Array();
    if (StringUtils.getLength(array) > 0) {
      array.forEach(e => {
        const element = new ConfigModel();
        element.id = StringUtils.isEmpty(e.id) ? e.name : e.id;
        element.key = e.name;
        element.title = e.name;
        if (StringUtils.isEmpty(e.value)) {
          element.value = e.type;
        } else {
          element.value = e.value;
        }
        if (StringUtils.isNotEmpty(e.database)) {
          element.database = e.database;
        }
        if (StringUtils.isNotEmpty(e.table)) {
          element.table = e.table;
        }
        element.type = type;
        elements.push(element);
      });
    }
    return elements;
  }

  public static findParentNode(node: NzTreeNode): NzTreeNode {
    if (node.getParentNode() !== null) {
      this.findParentNode(node.getParentNode());
    }
    return node;
  }
}
