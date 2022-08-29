import { AfterViewInit, Component, Input } from "@angular/core";
import { DesignerApplyData } from "@renderer/app/views/object_designer/model/designer.apply.data";
import { PluginFactory } from "@renderer/factory/plugin.factory";
import { RequestModel } from "@renderer/model/request.model";
import { ConfigFactory } from "@renderer/factory/config.factory";
import { StringUtils } from "@renderer/utils/string.utils";

@Component({
  selector: 'object-designer-layout-content-detail-database',
  templateUrl: './detail.database.view.html',
  styleUrls: ['./detail.database.style.scss']
})
export class LayoutContentDetailDatabaseComponent implements AfterViewInit {
  @Input()
  applyData: DesignerApplyData;

  tableDataSize = 0;
  applyResultColumns = [];
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
    }, 0)
  }
}
