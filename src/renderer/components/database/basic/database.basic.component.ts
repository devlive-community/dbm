import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { DatabaseConfig } from '@renderer/config/database.config';
import { ConfigModel } from '@renderer/model/config.model';
import { DatabaseModel } from '@renderer/model/database.model';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { MetadataService } from '@renderer/services/management/metadata.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StringUtils } from '@renderer/utils/string.utils';
import { RequestModel } from '@renderer/model/request.model';
import { DatabaseEnum } from '@renderer/enum/database.enum';
import * as cloneDeep from 'lodash/cloneDeep';
import { PropertyModel } from '@renderer/model/property.model';
import { NzTreeNode } from 'ng-zorro-antd/core/tree/nz-tree-base-node';
import { MenuModel } from '@renderer/model/menu.model';

@Component({
  selector: 'app-component-database',
  templateUrl: './database.basic.component.html'
})
export class DatabaseBasicComponent extends BaseComponent {
  @Input()
  visible: boolean;
  @Input()
  config: ConfigModel;
  @Input()
  node: NzTreeNode;
  @Input()
  menu: MenuModel;
  @Output()
  emitter = new EventEmitter<ConfigModel>();
  current = 0;
  databaseSelectValue: string;
  databaseEngines: DatabaseModel[];
  configure: DatabaseModel;
  databaseType = DatabaseEnum;
  properties: PropertyModel[];

  constructor(private dataSourceService: DatasourceService,
              private metadataService: MetadataService,
              private messageService: NzMessageService) {
    super();
    this.databaseEngines = new DatabaseConfig().getConfig();
    this.configure = new DatabaseModel();
  }

  handlerCancel() {
    this.visible = false;
    this.emitter.emit(this.config);
  }

  handlerPrevious(): void {
    this.current -= 1;
    this.configure = new DatabaseModel();
    this.disabled.button = true;
    this.databaseSelectValue = null;
  }

  handlerChange(value) {
    this.configure = cloneDeep(value);
    this.configure.name = null;
    this.properties = cloneDeep(this.configure.properties);
    this.configure.properties = null;
  }

  handlerNext(): void {
    this.current += 1;
  }

  handlerValidate() {
    let flag = true;
    if (this.configure?.property) {
      flag = this.configure?.property?.validate;
    }
    if (StringUtils.isNotEmpty(this.configure.name) && flag) {
      this.disabled.button = false;
    } else {
      this.disabled.button = true;
    }
  }

  handlerComponentEmitter($event) {
    this.configure.property = $event;
    this.handlerValidate();
  }

  async handlerComplete() {
    const request = new RequestModel();
    request.config = await this.dataSourceService.getByAliasAsync(this.config.value);
    this.metadataService.createDatabase(request, this.configure).then(response => {
      if (response.status) {
        this.messageService.success(response.message);
        this.config.status = true;
        this.config.menu = this.menu;
        this.config.currentNode = this.node;
        this.emitter.emit(this.config);
      } else {
        this.messageService.error(response.message);
      }
    });
  }
}
