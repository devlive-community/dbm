import { AfterViewInit, Component, Input } from "@angular/core";
import { DesignerApplyData } from "@renderer/app/views/object_designer/model/designer.apply.data";
import { PluginFactory } from "@renderer/factory/plugin.factory";
import { ConfigFactory } from "@renderer/factory/config.factory";
import { StringUtils } from "@renderer/utils/string.utils";
import { RequestModel } from "@renderer/model/request.model";

@Component({
  selector: 'object-designer-layout-content-preview-table',
  templateUrl: './preview.table.view.html',
  styleUrls: ['./preview.table.style.scss']
})
export class PreviewTableComponent implements AfterViewInit {
  @Input()
  applyData: DesignerApplyData;

  loading = {
    tableContainer: false
  }
  applyResult = {
    headers: [],
    columns: [],
    checkedColumns: []
  }
  applyVisible = {
    columnDrawer: null
  }

  constructor(private pluginFactory: PluginFactory,
              private configFactory: ConfigFactory) {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loading.tableContainer = true;
      const request = new RequestModel();
      request.config = this.applyData.dataSource;
      const type = this.applyData.dataSource.type;
      const sql = StringUtils.format(this.configFactory.createConfig(type).getStatement('metadataManagementFetchTableData'),
        [this.applyData.database, this.applyData.table, 0, 100]);

      this.pluginFactory.createService(type)
        .getResponse(request, sql)
        .then(response => {
          if (response.status) {
            response.data.headers.forEach(column => {
              this.applyResult.headers.push(column['name']);
              this.applyResult.checkedColumns.push({label: column['name'], value: column['name'], checked: true})
            })
            this.applyResult.columns = response.data.columns;
          }
          this.loading.tableContainer = false;
        });
    }, 0);
  }

  handlerShowColumnDrawer(value: string) {
    this.applyVisible.columnDrawer = value;
  }

  handlerCloseColumnDrawer() {
    this.applyVisible.columnDrawer = null;
  }

  handlerColumnChecked() {
    this.applyResult.headers = this.applyResult.checkedColumns
      .filter(item => item.checked)
      .map(item => item.value);
  }
}
