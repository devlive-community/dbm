import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DesignerApplyData } from "@renderer/app/views/object_designer/model/designer.apply.data";
import { DesignerColumn } from "@renderer/app/views/object_designer/model/designer.column";
import { StringUtils } from "@renderer/utils/string.utils";
import { BuilderFactory } from "@renderer/factory/builder.factory";
import { PluginFactory } from "@renderer/factory/plugin.factory";
import { RequestModel } from "@renderer/model/request.model";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
  selector: 'object-designer-layout-header-operator-table-create',
  templateUrl: './operator.table.create.view.html',
  styleUrls: ['./operator.table.create.style.scss']
})
export class LayoutHeaderOperatorTableCreateComponent {
  @Input()
  applyData: DesignerApplyData;
  @Input()
  applyColumns: DesignerColumn[];
  @Output()
  emitterColumns = new EventEmitter<DesignerColumn[]>;

  applyTableName: string;

  constructor(private builderFactory: BuilderFactory,
              private pluginFactory: PluginFactory,
              private messageService: NzMessageService) {
  }

  handlerCreateTable(): void {
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

  handlerPlusColumn(): void {
    const milliseconds = new Date().getTime();
    const random = (Math.random() * milliseconds).toFixed(0);
    const id = StringUtils.format('{0}_{1}', [milliseconds, random]);
    const column = new DesignerColumn();
    column.id = id;
    this.applyColumns = [...this.applyColumns, column];
    this.emitterColumns.emit(this.applyColumns);
  }
}
