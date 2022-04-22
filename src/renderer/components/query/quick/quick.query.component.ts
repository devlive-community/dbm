import { BaseComponent } from '@renderer/app/base.component';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { DatasourceModel } from '@renderer/model/datasource.model';
import { QuickEnum } from '@renderer/enum/quick.enum';
import { QueryService } from '@renderer/services/query/query.service';
import { RequestModel } from '@renderer/model/request.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QueryQuickService } from '@renderer/services/query/query.quick.service';
import { StringUtils } from '@renderer/utils/string.utils';

@Component({
  selector: 'app-component-quick-query',
  templateUrl: './quick.query.component.html'
})
export class QuickQueryComponent extends BaseComponent {
  @Input()
  visible: boolean;
  @Output()
  emitter = new EventEmitter<any>();
  @Output()
  emitterValue = new EventEmitter<any>();
  dataSourceSet: DatasourceModel[];
  databaseSet: any[];
  tableSet: any[];
  dataSource: string = null;
  database: string = null;
  table: string = null;
  loading = {
    button: false,
    database: false,
    table: false
  };
  quickCommands: any[];

  constructor(private dataSourceService: DatasourceService,
              private queryService: QueryService,
              private messageService: NzMessageService,
              private queryQuickService: QueryQuickService) {
    super();
    this.quickCommands = this.queryQuickService.getQuickAll();
    this.dataSourceService.getAll().then(response => {
      this.dataSourceSet = response;
    });
  }

  handlerCancel() {
    this.visible = false;
    this.emitter.emit(this.visible);
  }

  handlerChangeValue(quick: QuickEnum) {
    this.table = null;
    const request = new RequestModel();
    this.dataSourceService.findByAlias(this.dataSource).then(response => {
      request.config = response;
      switch (quick) {
        case QuickEnum.database:
          this.disabled.dialog = true;
          this.loading.database = true;
          this.databaseSet = [];
          this.queryService.getResponse(request, 'SHOW DATABASES').then(response => {
            if (response.status) {
              this.databaseSet = response.data.columns;
            } else {
              this.messageService.error(response.message);
            }
            this.loading.database = false;
            this.disabled.dialog = false;
          });
          break;
        case QuickEnum.table:
          this.tableSet = [];
          this.queryService.getResponse(request, 'SHOW TABLES FROM ' + this.database).then(response => {
            if (response.status) {
              this.tableSet = response.data.columns;
            } else {
              this.messageService.error(response.message);
            }
            this.loading.table = false;
          });
          break;
      }
    });
  }

  handlerQuickCommand(command: { name: string, value: string }) {
    const sql = StringUtils.format(command.value, [this.database, this.table]);
    this.emitterValue.emit(sql);
    this.handlerCancel();
  }
}
