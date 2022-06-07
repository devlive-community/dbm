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
import { DatabaseEnum } from "@renderer/enum/database.enum";
import { FactoryService } from "@renderer/services/factory.service";

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
  tableSchemaSet: any[];
  dataSource: string = null;
  database: string = null;
  table: string = null;
  tableSchema: string = null;
  loading = {
    button: false,
    database: false,
    table: false
  };
  quickCommands: any[];
  quickType = QuickEnum;
  spanSize = 8;

  constructor(private dataSourceService: DatasourceService,
              private queryService: QueryService,
              private messageService: NzMessageService,
              private queryQuickService: QueryQuickService,
              private factoryService: FactoryService) {
    super();
    this.quickCommands = this.queryQuickService.getQuickAll();
    this.dataSourceService.getAll().then(response => {
      this.dataSourceSet = response.map(item => {
        if (item.type === DatabaseEnum.mysql) {
          item.status = false;
        }
        return item;
      });
    });
  }

  handlerCancel() {
    this.visible = false;
    this.emitter.emit(this.visible);
  }

  handlerChangeValue(quick: QuickEnum, value?: any) {
    this.table = null;
    const request = new RequestModel();
    let sql;
    const response = this.dataSourceSet.find(item => item.alias === this.dataSource);
    request.config = response;
    if (response.type === DatabaseEnum.presto || response.type === DatabaseEnum.trino) {
      this.spanSize = 6;
    } else {
      this.spanSize = 8;
    }
    switch (quick) {
      case QuickEnum.database:
        this.disabled.dialog = true;
        this.loading.database = true;
        this.databaseSet = [];
        sql = this.factoryService.forward(request.config.type).databaseFetchAll;
        this.queryService.getResponse(request, sql).then(response => {
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
        if (this.spanSize === 8) {
          sql = StringUtils.format(this.factoryService.forward(request.config.type).tableFetchAll, [this.database]);
        } else {
          sql = StringUtils.format(this.factoryService.forward(request.config.type).schemaFetchAll, [this.database]);
        }
        this.queryService.getResponse(request, sql).then(response => {
          if (response.status) {
            this.tableSet = response.data.columns;
          } else {
            this.messageService.error(response.message);
          }
          this.loading.table = false;
        });
        break;
      case QuickEnum.table_schema:
        this.table = value;
        if (this.spanSize === 6) {
          this.tableSchemaSet = [];
          sql = StringUtils.format(this.factoryService.forward(request.config.type).tableSchemaFetchAll,
            [this.database, this.table]);
          this.queryService.getResponse(request, sql).then(response => {
            if (response.status) {
              this.tableSchemaSet = response.data.columns;
            } else {
              this.messageService.error(response.message);
            }
          });
          break;
        }
    }
  }

  handlerQuickCommand(command: { name: string, value: string }) {
    let sql;
    if (this.spanSize === 8) {
      sql = StringUtils.format(command.value, [this.database, this.table]);
    } else {
      sql = StringUtils.format(command.value,
        [StringUtils.format('{0}.{1}', [this.database, this.table]), this.tableSchema]);
    }
    this.emitterValue.emit(sql);
    this.handlerCancel();
  }
}
