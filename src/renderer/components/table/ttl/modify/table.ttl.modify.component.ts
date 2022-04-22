import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { ConfigModel } from '@renderer/model/config.model';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TableService } from '@renderer/services/management/table.service';
import { DatabaseModel } from '@renderer/model/database.model';
import { RequestModel } from '@renderer/model/request.model';
import { StringUtils } from '@renderer/utils/string.utils';
import { TableTtlModel } from '@renderer/model/table/table.ttl.model';

@Component({
  selector: 'app-component-table-ttl-modify',
  templateUrl: './table.ttl.modify.component.html'
})
export class TableTtlModifyComponent extends BaseComponent implements AfterViewInit {
  @Input()
  config: ConfigModel;
  @Input()
  value: string;
  @Input()
  database: string;
  @Output()
  emitter = new EventEmitter<any>();
  columns: any[];
  intervals = ['SECOND', 'MINUTE', 'HOUR', 'DAY', 'WEEK', 'MONTH', 'QUARTER', 'YEAR'];
  ttlConfig: TableTtlModel;

  constructor(private dataSourceService: DatasourceService,
              private tableService: TableService,
              private messageService: NzMessageService) {
    super();
    this.ttlConfig = new TableTtlModel();
  }

  async ngAfterViewInit() {
    this.tableService.getTimeColumns(await this.handlerGetRequest(), this.handlerGetDatabaseModel())
    .then(response => {
      if (response.status) {
        this.columns = response.data.columns;
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

  handlerSwitch() {
    this.disabled.button = true;
    this.ttlConfig.value = null;
  }

  handlerValidate() {
    const flag = StringUtils.isNotEmpty(this.ttlConfig.column);
    if (this.ttlConfig.custom) {
      if (flag && StringUtils.isNotEmpty(this.ttlConfig.value) && this.ttlConfig.ranger > 0) {
        this.disabled.button = false;
      } else {
        this.disabled.button = true;
      }
    } else {
      if (flag && StringUtils.isNotEmpty(this.ttlConfig.value)) {
        this.disabled.button = false;
      } else {
        this.disabled.button = true;
      }
    }
  }

  async handlerSave() {
    this.loading.button = true;
    this.ttlConfig.database = this.database;
    this.ttlConfig.table = this.value;
    this.tableService.modifyTTL(await this.handlerGetRequest(), this.ttlConfig)
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
