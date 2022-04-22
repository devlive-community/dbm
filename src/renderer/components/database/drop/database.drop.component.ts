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
import { ResponseDataModel } from '@renderer/model/response.model';
import { DatabaseModel } from '@renderer/model/database.model';
import { TableService } from '@renderer/services/management/table.service';

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
  tables: ResponseDataModel;
  deleteTable = false;

  constructor(private dataSourceService: DatasourceService,
              private metadataService: MetadataService,
              private databaseService: DatabaseService,
              private tableService: TableService,
              private messageService: NzMessageService) {
    super();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.handlerCheckTables();
    }, 0);
  }

  async handlerCheckTables() {
    this.getTables = true;
    const request = new RequestModel();
    request.config = await this.dataSourceService.getByAliasAsync(this.config.value);
    this.databaseService.getTables(request, this.value).then(response => {
      if (response.status) {
        this.tables = response.data;
        this.handlerValidate();
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
    if (this.inputValue === this.value && this.tables?.columns?.length <= 0) {
      this.disabled.button = false;
    } else {
      this.disabled.button = true;
    }
  }

  async handlerDelete() {
    this.loading.button = true;
    const request = new RequestModel();
    request.config = await this.dataSourceService.getByAliasAsync(this.config.value);
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

  async handlerDeleteTable(table: any) {
    this.deleteTable = true;
    const request = new RequestModel();
    request.config = await this.dataSourceService.getByAliasAsync(this.config.value);
    const _value = new DatabaseModel();
    _value.database = this.value;
    _value.name = table.name;
    this.tableService.delete(request, _value).then(response => {
      if (response.status) {
        this.messageService.success(response.message);
        this.handlerCheckTables();
      } else {
        this.messageService.error(response.message);
      }
      this.deleteTable = false;
    });
  }
}
