import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { TableConfig } from '@renderer/config/table.config';
import { ColumnModel } from '@renderer/model/column.model';
import { ConfigModel } from '@renderer/model/config.model';
import { DatabaseModel } from '@renderer/model/database.model';
import { PropertyModel } from '@renderer/model/property.model';
import { RequestModel } from '@renderer/model/request.model';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { TableService } from '@renderer/services/management/table.service';
import { StringUtils } from '@renderer/utils/string.utils';
import * as cloneDeep from 'lodash/cloneDeep';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-component-create-table',
  templateUrl: './table.create.component.html'
})
export class CreateTableComponent extends BaseComponent {
  @Input()
  config: ConfigModel;
  @Input()
  value: string;
  @Output()
  emitter = new EventEmitter<boolean>();
  current = 0;
  tableEngines: DatabaseModel[];
  configure: DatabaseModel;
  properties: PropertyModel[];
  selectValue: string;
  columns: ColumnModel[] = new Array();
  columnTypes: string[] = new Array();

  constructor(private tableService: TableService,
    private dataSourceService: DatasourceService,
    private messageService: NzMessageService) {
    super();
    this.tableEngines = new TableConfig().getConfigFromJson();
    this.columnTypes.push('Int8',
      'Int16',
      'Int32',
      'Int64',
      'Int128',
      'TINYINT',
      'UInt8',
      'UInt16',
      'UInt32',
      'UInt64',
      'UInt128',
      'String',
      'BLOB',
      'Nullable',
      'Date',
      'Float32',
      'Float64',
      'BIGINT');
  }

  handlerChange(value: DatabaseModel) {
    this.configure = cloneDeep(value);
    this.configure.name = null;
    this.properties = cloneDeep(this.configure.properties);
    this.configure.properties = null;
  }

  handlerValidate() {
    let flag = true;
    if (this.configure?.property) {
      flag = this.configure?.property?.validate;
    }
    if (StringUtils.isNotEmpty(this.configure.name) && flag && this.columns.length > 0) {
      this.disabled.button = false;
    } else {
      this.disabled.button = true;
    }
  }

  handlerAddColumn() {
    this.columns.push(new ColumnModel());
  }

  handlerRemoveColumn(column: ColumnModel) {
    const index = this.columns.indexOf(column)
    if (index !== -1) {
      this.columns.splice(index, 1)
    }
  }

  handlerNext(): void {
    this.current += 1;
  }

  handlerComponentEmitter($event) {
    this.configure.property = $event;
    this.handlerValidate();
  }

  handlerPrevious(): void {
    this.current -= 1;
    this.configure = new DatabaseModel();
    this.disabled.button = true;
    this.selectValue = null;
    this.columns.length = 0;
  }

  handlerComplete(): void {
    const request = new RequestModel();
    request.config = this.dataSourceService.getAll(this.config.value)?.data?.columns[0];
    this.configure.database = this.value;
    this.tableService.createTable(request, this.configure, this.columns).then(response => {
      if (response.status) {
        this.messageService.success(response.message);
        this.emitter.emit(true);
      } else {
        this.messageService.error(response.message);
      }
    });
  }
}
