import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { ConfigModel } from '@renderer/model/config.model';
import { RequestModel } from '@renderer/model/request.model';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { StringUtils } from '@renderer/utils/string.utils';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DatabaseService } from '@renderer/services/management/database.service';

@Component({
  selector: 'app-component-rename-database',
  templateUrl: './database.rename.component.html'
})
export class DatabaseRenameComponent extends BaseComponent implements AfterViewInit {
  @Input()
  config: ConfigModel;
  @Input()
  value: string;
  @Output()
  emitter = new EventEmitter<any>();
  inputValue: string;
  checkStatus = false;

  constructor(private dataSourceService: DatasourceService,
              private databaseService: DatabaseService,
              private messageService: NzMessageService) {
    super();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.handlerCheckDatabaseStatus();
    }, 0);
  }

  async handlerCheckDatabaseStatus() {
    this.checkStatus = true;
    const request = new RequestModel();
    request.config = await this.dataSourceService.getByAliasAsync(this.config.value);
    this.databaseService.getDatabase(request, this.value)
    .then(response => {
      if (response.status) {
        this.checkStatus = response.data?.columns[0]?.isSupport;
      } else {
        this.messageService.error(response.message);
      }
    });
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
    this.databaseService.rename(request, this.value, this.inputValue)
    .then(response => {
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
}
