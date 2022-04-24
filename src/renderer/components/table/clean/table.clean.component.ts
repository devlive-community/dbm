import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { LogicEnum } from '@renderer/enum/logic.enum';
import { ConfigModel } from '@renderer/model/config.model';
import { DatabaseModel } from '@renderer/model/database.model';
import { RequestModel } from '@renderer/model/request.model';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { TableService } from '@renderer/services/management/table.service';
import { ValidateUtils } from '@renderer/utils/validate.utils';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StringUtils } from '@renderer/utils/string.utils';
import { ResponseDataModel } from '@renderer/model/response.model';

@Component({
  selector: 'app-component-clean-table',
  templateUrl: './table.clean.component.html'
})
export class CleanTableComponent extends BaseComponent implements AfterViewInit {
  @Input()
  config: ConfigModel;
  @Input()
  value: string;
  @Input()
  database: string;
  @Output()
  emitter = new EventEmitter<any>();
  allowValue = {
    partition: null,
    logic: null
  };
  partitions: any[];
  allowPartitions: ResponseDataModel;
  logic = LogicEnum;
  deletePartition = false;

  constructor(private dataSourceService: DatasourceService,
              private tableService: TableService,
              private messageService: NzMessageService) {
    super();
  }

  async ngAfterViewInit() {
    this.tableService.getPartitions(await this.handlerGetRequest(), this.handlerGetDatabaseModel())
    .then(response => {
      if (response.status) {
        this.partitions = response.data.columns;
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

  async handlerValidate() {
    if (ValidateUtils.validate(this.allowValue)) {
      this.deletePartition = true;
      this.tableService.getPartitions(await this.handlerGetRequest(),
        this.handlerGetDatabaseModel(),
        StringUtils.appendBackslash(this.allowValue.partition),
        this.allowValue.logic)
      .then(response => {
        if (response.status) {
          this.allowPartitions = response.data;
          if (this.allowPartitions?.columns.length > 0) {
            this.disabled.button = false;
          } else {
            this.disabled.button = false;
          }
        } else {
          this.messageService.error(response.message);
        }
        this.deletePartition = false;
      });
    } else {
      this.disabled.button = true;
    }
  }

  async handlerClean(value: string) {
    this.loading.button = true;
    this.tableService.clean(await this.handlerGetRequest(),
      this.handlerGetDatabaseModel(),
      StringUtils.appendBackslash(value))
    .then(response => {
      if (response.status) {
        this.messageService.success(response.message);
        this.handlerValidate();
        // this.allowPartitions = this.allowPartitions?.columns.filter(v => v.id !== value);
      } else {
        this.messageService.error(response.message);
      }
      this.loading.button = false;
    });
  }
}
