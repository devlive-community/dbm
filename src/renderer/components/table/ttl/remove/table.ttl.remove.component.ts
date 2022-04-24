import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { ConfigModel } from '@renderer/model/config.model';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TableService } from '@renderer/services/management/table.service';
import { DatabaseModel } from '@renderer/model/database.model';
import { RequestModel } from '@renderer/model/request.model';
import { TableTtlModel } from '@renderer/model/table/table.ttl.model';

@Component({
  selector: 'app-component-table-ttl-remove',
  templateUrl: './table.ttl.remove.component.html'
})
export class TableTtlRemoveComponent extends BaseComponent implements AfterViewInit {
  @Input()
  config: ConfigModel;
  @Input()
  value: string;
  @Input()
  database: string;
  @Output()
  emitter = new EventEmitter<any>();
  ttlConfig: any;
  ttlInstance: TableTtlModel;

  constructor(private dataSourceService: DatasourceService,
              private tableService: TableService,
              private messageService: NzMessageService) {
    super();
    this.ttlInstance = new TableTtlModel();
  }

  async ngAfterViewInit() {
    this.ttlInstance.database = this.database;
    this.ttlInstance.table = this.value;
    this.tableService.getTTL(await this.handlerGetRequest(), this.ttlInstance)
    .then(response => {
      if (response.status) {
        this.ttlConfig = response.data.columns[0];
      } else {
        this.messageService.error(response.message);
      }
    });
  }

  async handlerGetRequest(): Promise<RequestModel> {
    const request = new RequestModel();
    request.config = await this.dataSourceService.getByAliasAsync(this.config.value);
    return request;
  }

  handlerGetDatabaseModel(): DatabaseModel {
    const _value = new DatabaseModel();
    _value.database = this.database;
    _value.name = this.value;
    return _value;
  }

  async handlerRemove() {
    this.loading.button = true;
    this.tableService.removeTTL(await this.handlerGetRequest(), this.ttlInstance)
    .then(response => {
      if (response.status) {
        this.messageService.success(response.message);
        this.emitter.emit(true);
      } else {
        this.messageService.error(response.message);
      }
      this.loading.button = false;
    });
  }
}
