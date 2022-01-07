import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { TreeModel } from '@renderer/model/tree.model';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { TypeEnum } from '@renderer/enum/type.enum';
import { TranslateService } from '@ngx-translate/core';
import { MetadataService } from '@renderer/services/management/metadata.service';
import { RequestModel } from '@renderer/model/request.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-management-metadata',
  templateUrl: 'metadata.component.html'
})
export class MetadataComponent extends BaseComponent implements OnInit {
  nodes: TreeModel[];
  items: any[];
  selectNode: any;
  switchType = TypeEnum.server;

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
      treeNode.type = TypeEnum.server;
      return treeNode;
    });
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
    if (event.node !== undefined) {
      this.selectNode = event.node.origin;
    }
    if (this.switchType) {
      this.selectNode.type = TypeEnum.server;
    } else {
      this.selectNode.type = TypeEnum.database;
    }
    const request = new RequestModel();
    request.config = this.dataSourceService.getAll(this.selectNode.value)?.data?.columns[0];
    this.metadataService.getDiskUsedAndRatio(request, this.selectNode).then(response => {
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
    if (node?.getChildren().length === 0 && node?.isExpanded) {
      this.loadNode().then(data => {
        node.addChildren(data);
        node.parentNode.title = node.parentNode.title + data.length;
      });
    }
  }

  handlerKeys(item: any) {
    return Object.keys(item);
  }

  loadNode(): Promise<NzTreeNodeOptions[]> {
    return new Promise(resolve => {
      resolve([
        {title: 'Child Node', key: `${new Date().getTime()}-0`},
        {title: 'Child Node', key: `${new Date().getTime()}-1`}
      ]);
    });
  }
}
