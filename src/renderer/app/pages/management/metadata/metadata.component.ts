import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { ConfigModel } from '@renderer/model/config.model';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { TypeEnum } from '@renderer/enum/type.enum';
import { TranslateService } from '@ngx-translate/core';
import { MetadataService } from '@renderer/services/management/metadata.service';
import { RequestModel } from '@renderer/model/request.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TreeUtils } from '@renderer/utils/tree.utils';
import { ContextMenuService } from '@renderer/services/context.menu.service';
import { MenuModel } from '@renderer/model/menu.model';

@Component({
  selector: 'app-management-metadata',
  templateUrl: 'metadata.component.html'
})
export class MetadataComponent extends BaseComponent implements OnInit {
  nodes: ConfigModel[];
  items: any[];
  selectNode: any;
  selectMenu: MenuModel;
  rootNode: any;
  switchType = TypeEnum.disk;
  outerHeight: number;
  contextMenus: MenuModel[];
  disabledComponent = {
    server: false,
    database: false
  };

  constructor(private nzContextMenuService: NzContextMenuService,
              private dataSourceService: DatasourceService,
              private translateService: TranslateService,
              private metadataService: MetadataService,
              private messageService: NzMessageService,
              private contextMenuService: ContextMenuService) {
    super();
    this.nodes = this.dataSourceService.getAll()?.data?.columns.map(k => {
      const configModel = new ConfigModel();
      configModel.key = k.name;
      configModel.value = k.alias;
      configModel.title = k.alias;
      configModel.type = TypeEnum.disk;
      return configModel;
    });
    this.outerHeight = window.outerHeight;
  }

  ngOnInit(): void {
  }

  handlerContextMenu($event: MouseEvent, menu: NzDropdownMenuComponent, origin: any): void {
    if (!origin.level) {
      this.rootNode = origin;
    }
    this.contextMenus = this.contextMenuService.getContextMenu(origin.type);
    this.nzContextMenuService.create($event, menu);
  }

  handlerContextMenuClick(menu: MenuModel): void {
    this.selectMenu = menu;
    switch (menu.type) {
      case TypeEnum.server:
        this.disabledComponent.server = true;
        break;
      case TypeEnum.database:
        this.disabledComponent.database = true;
        break;
    }
  }

  handlerContextMenuClose() {
    switch (this.selectMenu.type) {
      case TypeEnum.server:
        this.disabledComponent.server = false;
        break;
      case TypeEnum.database:
        this.disabledComponent.database = false;
        break;
    }
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
