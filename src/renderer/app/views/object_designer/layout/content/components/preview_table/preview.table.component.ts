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
    columnDrawer: false
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
            if (response.data.rows > 0) {
              Object.keys(response.data.columns[0]).forEach(column => {
                this.applyResult.headers.push(column);
                this.applyResult.checkedColumns.push({label: column, value: column, checked: true})
              })
              this.applyResult.columns = response.data.columns;
            }
          }
          this.loading.tableContainer = false;
        });
    }, 0);
  }

  handlerShowColumnDrawer() {
    this.applyVisible.columnDrawer = true;
  }

  handlerCloseColumnDrawer() {
    this.applyVisible.columnDrawer = false;
  }

  handlerColumnChecked() {
    this.applyResult.headers = this.applyResult.checkedColumns
      .filter(item => item.checked)
      .map(item => item.value);
  }
}
