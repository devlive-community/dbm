import { AfterViewInit, Component, Input } from "@angular/core";
import { DesignerApplyData } from "@renderer/app/views/object_designer/model/designer.apply.data";
import { PluginFactory } from "@renderer/factory/plugin.factory";
import { RequestModel } from "@renderer/model/request.model";
import { ConfigFactory } from "@renderer/factory/config.factory";
import { StringUtils } from "@renderer/utils/string.utils";
import { ActionEnum } from "@renderer/enum/action.enum";
import { TypeEnum } from "@renderer/enum/type.enum";
import { AssertUtils } from "@renderer/app/views/object_designer/utils/assert.utils";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
  selector: 'object-designer-layout-content-detail-database',
  templateUrl: './detail.database.view.html',
  styleUrls: ['./detail.database.style.scss']
})
export class LayoutContentDetailDatabaseComponent implements AfterViewInit {
  @Input()
  applyData: DesignerApplyData;

  loading = {
    tableContainer: false,
  }
  tableDataSize = 0;
  applyResultColumns = [];
  applySelectTable = {
    checkedTables: new Set<string>()
  }
  deleteTable = {
    visible: false,
    loading: false
  }

  constructor(private pluginFactory: PluginFactory,
              private configFactory: ConfigFactory,
              private messageService: NzMessageService) {
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.handlerInitializer(), 0)
  }

  handlerInitializer() {
    this.loading.tableContainer = true;
    this.tableDataSize = 0;
    const request = new RequestModel();
    request.config = this.applyData.dataSource;
    const type = this.applyData.dataSource.type;
    const sql = StringUtils.format(this.configFactory.createConfig(type).getStatement('metadataManagementFetchTables'),
      [this.applyData.database]);

    this.pluginFactory.createService(type)
      .getResponse(request, sql)
      .then(response => {
        if (response.status) {
          this.tableDataSize = response.data.rows;
          if (this.tableDataSize > 0) {
            this.applyResultColumns = response.data.columns;
          }
        }
        this.loading.tableContainer = false;
      });
  }

  handlerNewTable() {
    this.applyData.command.action = ActionEnum.create;
    this.applyData.command.type = TypeEnum.table;
  }

  handlerTableChecked(tableName: string, checked: boolean) {
    if (checked) {
      this.applySelectTable.checkedTables.clear();
      this.applySelectTable.checkedTables.add(tableName);
      this.applyData.table = tableName;
    } else {
      this.applySelectTable.checkedTables.delete(tableName);
      this.applyData.table = null;
    }
  }

  handlerApplyDeleteTable() {
    this.deleteTable.visible = true;
  }

  handlerCancelDeleteTable() {
    this.deleteTable.visible = false;
  }

  handlerDeleteTable() {
    this.deleteTable.loading = true;
    const request = new RequestModel();
    request.config = this.applyData.dataSource;
    const sql = StringUtils.format('DROP TABLE {0}.{1}', [this.applyData.database, this.applyData.table]);
    this.pluginFactory.createService(this.applyData.dataSource.type)
      .getResponse(request, sql)
      .then(response => {
        if (response.status) {
          this.messageService.success("OK");
          this.handlerInitializer();
        }
        this.deleteTable.loading = false;
        this.deleteTable.visible = false;
      });
  }

  isCreateTable(): boolean {
    return AssertUtils.isCreateTable(this.applyData);
  }
}
