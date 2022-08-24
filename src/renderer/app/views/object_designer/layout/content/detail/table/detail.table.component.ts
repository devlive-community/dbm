import { AfterViewInit, Component, Input } from "@angular/core";
import { DesignerApplyData } from "@renderer/app/views/object_designer/model/designer.apply.data";
import { PluginFactory } from "@renderer/factory/plugin.factory";
import { ConfigFactory } from "@renderer/factory/config.factory";
import { StringUtils } from "@renderer/utils/string.utils";
import { RequestModel } from "@renderer/model/request.model";
import { ResponseDataModel } from "@renderer/model/response.model";

import { TableSheet } from "@antv/s2";
import { debounce } from 'lodash';

@Component({
  selector: 'object-designer-layout-content-detail-table',
  templateUrl: './detail.table.view.html',
  styleUrls: ['./detail.table.style.scss']
})
export class LayoutDetailTableComponent implements AfterViewInit {
  @Input()
  applyData: DesignerApplyData;

  tableData = new ResponseDataModel();
  tableDataSize = 0;
  loading = {
    tableContainer: false
  }

  constructor(private pluginFactory: PluginFactory,
              private configFactory: ConfigFactory) {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loading.tableContainer = true;
      this.tableDataSize = 0;
      const request = new RequestModel();
      request.config = this.applyData.dataSource;
      const type = this.applyData.dataSource.type;
      const sql = StringUtils.format(this.configFactory.createConfig(type).getStatement('metadataManagementFetchTableData'),
        [this.applyData.database, this.applyData.table, 0, 100]);

      const container = document.getElementById('queryResultContainer');
      // Clear the last query result
      container.innerHTML = '';
      const s2Options = {
        width: this.applyData.width - 200,
        height: this.applyData.height,
      }

      this.pluginFactory.createService(type)
        .getResponse(request, sql)
        .then(response => {
          if (response.status) {
            this.tableDataSize = response.data.rows;
            if (this.tableDataSize > 0) {
              const s2DataConfig = {
                fields: {
                  columns: response.data.headers.map(item => item.name),
                },
                data: response.data.columns
              };
              const s2 = new TableSheet(container, s2DataConfig, s2Options);
              const debounceRender = debounce((width, height) => {
                s2.changeSheetSize(width, height)
                s2.render(false);
              }, 0)
              new ResizeObserver(([entry] = []) => {
                debounceRender(this.applyData.width - 205, this.applyData.height);
              }).observe(document.body);
              s2.render();
            }
          }
          this.loading.tableContainer = false;
        });
    }, 0);
  }
}
