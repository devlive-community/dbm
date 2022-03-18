import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { ConfigModel } from '@renderer/model/config.model';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { MetadataService } from '@renderer/services/management/metadata.service';
import { DatabaseService } from '@renderer/services/management/database.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestModel } from '@renderer/model/request.model';
import { MenuModel } from '@renderer/model/menu.model';
import { NzTreeNode } from 'ng-zorro-antd/core/tree/nz-tree-base-node';

@Component({
  selector: 'app-component-database-drop',
  templateUrl: './database.drop.component.html'
})
export class DatabaseDropComponent extends BaseComponent implements AfterViewInit {
  @Input()
  visible: boolean;
  @Input()
  config: ConfigModel;
  @Input()
  value: string;
  @Input()
  node: NzTreeNode;
  @Input()
  menu: MenuModel;
  @Output()
  emitter = new EventEmitter<ConfigModel>();
  inputValue: string;
  getTables = false;
  tables: any[];

  constructor(private dataSourceService: DatasourceService,
              private metadataService: MetadataService,
              private databaseService: DatabaseService,
              private messageService: NzMessageService) {
    super();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.handlerCheckTables();
    }, 0);
  }

  handlerCheckTables() {
    this.getTables = true;
    const request = new RequestModel();
    request.config = this.dataSourceService.getAll(this.config.value)?.data?.columns[0];
    this.databaseService.getTables(request, this.value).then(response => {
      if (response.status) {
        this.tables = response.data.columns;
      } else {
        this.messageService.error(response.message);
      }
      this.getTables = false;
    });
  }

  handlerCancel() {
    this.visible = false;
    this.emitter.emit(this.config);
  }

  handlerValidate() {
    if (this.inputValue === this.value && this.tables?.length <= 0) {
      this.disabled.button = false;
    } else {
      this.disabled.button = true;
    }
  }

  handlerDelete() {
    this.loading.button = true;
    const request = new RequestModel();
    request.config = this.dataSourceService.getAll(this.config.value)?.data?.columns[0];
    this.metadataService.delete(request, this.value).then(response => {
      if (response.status) {
        this.messageService.success(response.message);
        this.config.status = true;
        this.config.menu = this.menu;
        this.config.currentNode = this.node;
        this.emitter.emit(this.config);
      } else {
        this.messageService.error(response.message);
      }
      this.loading.button = false;
    });
  }

  handlerQuicklyEnter() {
    this.inputValue = this.value;
    this.handlerValidate();
  }
}
