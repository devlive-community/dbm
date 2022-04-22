import { Component } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { DatasourceModel } from '@renderer/model/datasource.model';
import { RequestModel } from '@renderer/model/request.model';
import { DatabaseService } from '@renderer/services/management/database.service';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { TableService } from '@renderer/services/management/table.service';
import { MigrateService } from '@renderer/services/tools/migrate.service';
import { StringUtils } from '@renderer/utils/string.utils';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-tools-migrte',
  templateUrl: 'migrte.component.html'
})
export class MigrteComponent extends BaseComponent {
  dataSources: DatasourceModel[];
  source = {datasource: null, databases: [], database: null, tables: [], table: null};
  target = {datasource: null, databases: [], database: null, tables: [], table: null};
  tableSizeInfo: any;

  constructor(private datasourceService: DatasourceService,
              private databaseService: DatabaseService,
              private messageService: NzMessageService,
              private tableService: TableService,
              private migrateService: MigrateService) {
    super();
    this.datasourceService.getAll().then(response => {
      this.dataSources = response;
    });
  }

  async handlerSwitchSource(type: boolean) {
    this.databaseService.getAll(await this.handlerRequest(type)).then(response => {
      if (response.status) {
        if (type) {
          this.source.databases = response.data.columns;
        } else {
          this.target.databases = response.data.columns;
        }
      } else {
        this.messageService.error(response.message);
      }
    });
    this.handlerValidate();
  }

  async handlerSwitchDatabase(type: boolean) {
    let database;
    if (type) {
      database = this.source.database;
    } else {
      database = this.target.database;
    }
    this.tableService.getAll(await this.handlerRequest(type), database).then(response => {
      if (response.status) {
        if (type) {
          this.source.tables = response.data.columns;
        } else {
          this.target.tables = response.data.columns;
        }
      } else {
        this.messageService.error(response.message);
      }
    });
    this.handlerValidate();
  }

  async handlerRequest(type: boolean) {
    const request = new RequestModel();
    if (type) {
      request.config = await this.datasourceService.getByAliasAsync(this.source.datasource);
    } else {
      request.config = await this.datasourceService.getByAliasAsync(this.target.datasource);
    }
    return request;
  }

  async handlerCheckTable() {
    const request = new RequestModel();
    request.config = await this.datasourceService.getByAliasAsync(this.source.datasource);
    this.tableService.getSize(request, this.source.database, this.source.table).then(response => {
      if (response.status) {
        if (response?.data?.columns.length > 0) {
          this.tableSizeInfo = response?.data?.columns[0];
        } else {
          this.tableSizeInfo = {flag: 0};
        }
      } else {
        this.messageService.error(response.message);
      }
    });
  }

  handlerValidate(): boolean {
    if (StringUtils.isNotEmpty(this.source.datasource)
      && StringUtils.isNotEmpty(this.source.database)
      && StringUtils.isNotEmpty(this.source.table)
      && StringUtils.isNotEmpty(this.target.datasource)
      && StringUtils.isNotEmpty(this.target.database)
      && this.tableSizeInfo?.flag === 0
    ) {
      return false;
    }
    return true;
  }

  async handlerMigrate() {
    this.loading.button = true;
    const response = await this.migrateService.migrate(this.source, this.target);
    if (response?.status) {
      this.loading.button = false;
      this.messageService.success(response?.message);
    } else {
      this.loading.button = false;
      this.messageService.error(response?.message);
    }
  }
}
