import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { ConfigModel } from '@renderer/model/config.model';
import { DatabaseModel } from '@renderer/model/database.model';
import { RequestModel } from '@renderer/model/request.model';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { TableService } from '@renderer/services/management/table.service';
import { StringUtils } from '@renderer/utils/string.utils';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-component-rename-table',
  templateUrl: './table.rename.component.html'
})
export class RenameTableComponent extends BaseComponent {
  @Input()
  config: ConfigModel;
  @Input()
  value: string;
  @Input()
  database: string;
  @Output()
  emitter = new EventEmitter<any>();
  inputValue: string;

  constructor(private dataSourceService: DatasourceService,
              private tableService: TableService,
              private messageService: NzMessageService) {
    super();
  }

  handlerValidate() {
    if (StringUtils.isNotEmpty(this.inputValue) && this.inputValue !== this.value) {
      this.disabled.button = false;
    } else {
      this.disabled.button = true;
    }
  }

  async handlerRename() {
    this.loading.button = true;
    const request = new RequestModel();
    request.config = await this.dataSourceService.getByAliasAsync(this.config.value);
    const _value = new DatabaseModel();
    _value.database = this.database;
    _value.name = this.value;
    this.tableService.rename(request, _value, this.inputValue).then(response => {
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
