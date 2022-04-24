import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { ConfigModel } from '@renderer/model/config.model';
import { DatabaseModel } from '@renderer/model/database.model';
import { RequestModel } from '@renderer/model/request.model';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { TableService } from '@renderer/services/management/table.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-component-delete-table',
  templateUrl: './table.delete.component.html'
})
export class DeleteTableComponent extends BaseComponent implements AfterViewInit {
  @Input()
  config: ConfigModel;
  @Input()
  value: string;
  @Input()
  database: string;
  @Output()
  emitter = new EventEmitter<ConfigModel>();
  inputValue: string;
  tableInfo = {flag: 1};

  constructor(private dataSourceService: DatasourceService,
              private tableService: TableService,
              private datasourceService: DatasourceService,
              private messageService: NzMessageService) {
    super();
  }

  ngAfterViewInit() {
    setTimeout(async () => {
      const request = new RequestModel();
      request.config = await this.dataSourceService.getByAliasAsync(this.config.value);
      this.tableService.getSize(request, this.database, this.value)
      .then(response => {
        if (response.status) {
          this.tableInfo = response.data?.columns[0];
        } else {
          this.messageService.error(response.message);
        }
      });
    }, 0);
  }

  handlerValidate() {
    if (this.inputValue === this.value) {
      this.disabled.button = false;
    } else {
      this.disabled.button = true;
    }
  }

  async handlerDelete() {
    this.loading.button = true;
    const request = new RequestModel();
    request.config = await this.dataSourceService.getByAliasAsync(this.config.value);
    const _value = new DatabaseModel();
    _value.database = this.database;
    _value.name = this.value;
    this.tableService.delete(request, _value).then(response => {
      if (response.status) {
        this.messageService.success(response.message);
        this.config.status = true;
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
