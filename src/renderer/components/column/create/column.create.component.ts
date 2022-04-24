import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { ConfigModel } from '@renderer/model/config.model';
import { DatabaseModel } from '@renderer/model/database.model';
import { RequestModel } from '@renderer/model/request.model';
import { ColumnService } from '@renderer/services/management/column.service';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ColumnModel } from '@renderer/model/column.model';
import { StringUtils } from '@renderer/utils/string.utils';
import { TypeEnum } from '@renderer/enum/type.enum';

@Component({
  selector: 'app-component-create-column',
  templateUrl: './column.create.component.html',
  styles: [
    `
      .container {
        display: flex;
        flex-wrap: nowrap;
        padding: 2px;
      }

      input {
      }

      .add-item {
        flex: 0 0 auto;
        margin: 4px;
        display: block;
      }
    `
  ]
})
export class ColumnCreateComponent extends BaseComponent {
  @Input()
  config: ConfigModel;
  @Input()
  database: string;
  @Input()
  table: string;
  @Input()
  value: string;
  @Output()
  emitter = new EventEmitter<ConfigModel>();
  columns: ColumnModel[] = new Array();
  columnTypes: string[] = new Array();

  constructor(private dataSourceService: DatasourceService,
              private columnService: ColumnService,
              private messageService: NzMessageService) {
    super();
    this.handlerAddRow();
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

  handlerValidate() {
    const columnArray = this.columns.filter(column => {
      if (StringUtils.isEmpty(column.name) || StringUtils.isEmpty(column.type)) {
        return false;
      }
      return true;
    });
    if (this.columns.length !== columnArray.length) {
      this.disabled.button = true;
    } else {
      this.disabled.button = false;
    }
  }

  handlerAddRow(): void {
    this.columns = [
      ...this.columns,
      new ColumnModel()
    ];
    this.handlerValidate();
  }

  handlerDeleteRow(column: ColumnModel): void {
    const index = this.columns.indexOf(column);
    if (index !== -1) {
      this.columns = this.columns.filter(d => d !== column);
    }
    this.handlerValidate();
  }

  handlerAddColumnType(input: HTMLInputElement): void {
    const value = input.value;
    if (this.columnTypes.indexOf(value) === -1) {
      this.columnTypes = [...this.columnTypes, input.value];
    }
  }

  async handlerSave() {
    this.loading.button = true;
    const request = new RequestModel();
    request.config = await this.dataSourceService.getByAliasAsync(this.config.value);
    const _value = new DatabaseModel();
    _value.database = this.database;
    _value.table = this.table;
    this.columnService.create(request, _value, this.columns).then(response => {
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
