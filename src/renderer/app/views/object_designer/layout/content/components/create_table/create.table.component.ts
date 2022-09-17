import { Component, Input } from "@angular/core";
import { DesignerApplyData } from "@renderer/app/views/object_designer/model/designer.apply.data";
import { DesignerColumn } from "@renderer/app/views/object_designer/model/designer.column";
import { StringUtils } from "@renderer/utils/string.utils";
import { BuilderFactory } from "@renderer/factory/builder.factory";
import { NzMessageService } from "ng-zorro-antd/message";
import { PluginFactory } from "@renderer/factory/plugin.factory";
import { RequestModel } from "@renderer/model/request.model";

@Component({
  selector: 'object-designer-layout-content-create-table',
  templateUrl: './create.table.view.html',
  styleUrls: ['./create.table.style.scss']
})
export class CreateTableComponent {
  @Input()
  applyData: DesignerApplyData;

  applyTableName: string;
  applyColumns: Array<DesignerColumn> = new Array<DesignerColumn>;
  applyCheckedColumns: Set<string> = new Set<string>;
  applyLastCheckedColumn: string = null;
  dataType = [
    'varchar',
    'int',
    'bigint',
    'date',
    'double',
    'float'
  ];
  applyEditor = {
    value: null,
    configuration: {
      minLines: 30,
      maxLines: 30,
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true
    }
  };
  applyTableEngines = ['Memory'];

  constructor(private builderFactory: BuilderFactory,
              private pluginFactory: PluginFactory,
              private messageService: NzMessageService) {
  }

  handlerAddDataType(input: HTMLInputElement): void {
    const value = input.value;
    if (this.dataType.indexOf(value) === -1) {
      this.dataType = [...this.dataType, input.value];
    }
  }

  handlerGenerateColumn(): DesignerColumn {
    const milliseconds = new Date().getTime();
    const random = (Math.random() * milliseconds).toFixed(0);
    const id = StringUtils.format('{0}_{1}', [milliseconds, random]);
    const column = new DesignerColumn();
    column.id = id;
    return column;
  }

  handlerPlusColumn() {
    this.applyColumns = [...this.applyColumns, this.handlerGenerateColumn()];
  }

  handlerPlusPreColumn() {
    if (this.applyCheckedColumns.size > 0) {
      // If contained selected columns are added to the previous row of the column by default
      const index = this.applyColumns.findIndex(item => this.applyLastCheckedColumn === item.id);
      this.applyColumns.splice(index, 0, this.handlerGenerateColumn());
      this.applyColumns = [...this.applyColumns];
    } else {
      // If not selected, the column is added to the first row by default
      this.applyColumns = [this.handlerGenerateColumn(), ...this.applyColumns];
    }
  }

  handlerMinusColumn() {
    this.applyColumns = this.applyColumns.filter(column => !this.applyCheckedColumns.has(column.id));
  }

  handlerColumnChecked(column: string, checked: boolean) {
    this.applyLastCheckedColumn = column;
    if (checked) {
      this.applyCheckedColumns.add(column);
    } else {
      this.applyCheckedColumns.delete(column);
      this.applyData.table = null;
    }
  }

  handlerSqlPreview() {
    const sql = this.builderFactory.createBuilder(this.applyData.dataSource.type)
      .builderCreateTable(this.applyData.database, this.applyTableName, this.applyData.engine, this.applyColumns);
    this.applyEditor.value = sql;
  }

  handlerCreateTable() {
    const sql = this.builderFactory.createBuilder(this.applyData.dataSource.type)
      .builderCreateTable(this.applyData.database, this.applyTableName, this.applyData.engine, this.applyColumns);
    const request = new RequestModel();
    request.config = this.applyData.dataSource;
    this.pluginFactory.createService(this.applyData.dataSource.type)
      .getResponse(request, sql)
      .then(response => {
        if (response.status) {
          this.messageService.success(response.message);
        } else {
          this.messageService.error(response.message);
        }
      });
  }
}
