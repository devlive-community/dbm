import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { TreeModel } from '@renderer/model/tree.model';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { TypeEnum } from '@renderer/enum/type.enum';
import { TranslateService } from '@ngx-translate/core';
import { MetadataService } from '@renderer/services/management/metadata.service';
import { RequestModel } from '@renderer/model/request.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TreeUtils } from '@renderer/utils/tree.utils';

@Component({
  selector: 'app-management-metadata',
  templateUrl: 'metadata.component.html'
})
export class MetadataComponent extends BaseComponent implements OnInit {
  nodes: TreeModel[];
  items: any[];
  selectNode: any;
  rootNode: any;
  switchType = TypeEnum.disk;
  outerHeight: number;

  constructor(private nzContextMenuService: NzContextMenuService,
              private dataSourceService: DatasourceService,
              private translateService: TranslateService,
              private metadataService: MetadataService,
              private messageService: NzMessageService) {
    super();
    this.nodes = this.dataSourceService.getAll()?.data?.columns.map(k => {
      const treeNode = new TreeModel();
      treeNode.key = k.name;
      treeNode.value = k.alias;
      treeNode.title = k.alias;
      treeNode.type = TypeEnum.disk;
      return treeNode;
    });
    this.outerHeight = window.outerHeight;
  }

  ngOnInit(): void {
  }

  handlerContextMenu($event: MouseEvent, menu: NzDropdownMenuComponent, type: TypeEnum): void {
    console.log(this.translateService.instant('common.add'));
    this.nzContextMenuService.create($event, menu);
  }

  handlerNodeClick(event: NzFormatEmitEvent): void {
    // if (event.node.isSelected) {
    this.loading.button = true;
    if (event.node?.level === 0) {
      this.rootNode = event.node.origin;
    }
    if (event.node !== undefined) {
      this.selectNode = event.node;
    }
    if (this.switchType) {
      this.selectNode.origin.type = TypeEnum.disk;
    } else {
      this.selectNode.origin.type = TypeEnum.server;
    }
    this.handlerLevel(this.selectNode);
    const request = new RequestModel();
    request.config = this.dataSourceService.getAll(this.rootNode.value)?.data?.columns[0];
    this.metadataService.getDiskUsedAndRatio(request, this.selectNode.origin).then(response => {
      if (response.status) {
        this.items = response.data.columns;
      } else {
        this.messageService.error(response.message);
      }
      this.loading.button = false;
    });
    // }
  }

  handlerNodeLoad(event: NzFormatEmitEvent): void {
    const node = event.node;
    this.handlerLevel(node);
    const originNode: any = event.node.origin;
    if (node?.level === 0) {
      originNode.type = TypeEnum.server;
    }
    if (node?.getChildren().length === 0 && node?.isExpanded) {
      const request = new RequestModel();
      request.config = this.dataSourceService.getAll(this.rootNode.value)?.data?.columns[0];
      this.metadataService.getChild(request, originNode).then(response => {
        if (response.status) {
          node.addChildren(TreeUtils.builderTreeNode(response.data.columns, originNode.type));
        } else {
          // this.messageService.error(response.message);
          node.addChildren([]);
        }
        this.loading.button = false;
      });
    }
  }

  handlerKeys(item: any) {
    return Object.keys(item);
  }

  handlerLevel(node) {
    switch (node.level) {
      case 0:
        this.rootNode = node.origin;
        break;
      case 1:
        node.origin.type = TypeEnum.database;
        break;
      case 2:
        node.origin.type = TypeEnum.table;
        break;
      case 3:
        node.origin.type = TypeEnum.column;
        break;
    }
  }
}
