import { AfterViewInit, Component, Input } from "@angular/core";
import { DesignerApplyData } from "@renderer/app/views/object_designer/model/designer.apply.data";
import { PluginFactory } from "@renderer/factory/plugin.factory";
import { ConfigFactory } from "@renderer/factory/config.factory";
import { StringUtils } from "@renderer/utils/string.utils";
import { RequestModel } from "@renderer/model/request.model";
import { ResponseDataModel } from "@renderer/model/response.model";

@Component({
  selector: 'object-designer-layout-content-detail-table',
  templateUrl: './detail.table.view.html',
  styleUrls: ['./detail.table.style.scss']
})
export class LayoutDetailTableComponent implements AfterViewInit {
  @Input()
  applyData: DesignerApplyData;

  tableData = new ResponseDataModel();

  constructor(private pluginFactory: PluginFactory,
              private configFactory: ConfigFactory) {
  }

  ngAfterViewInit(): void {
    const request = new RequestModel();
    request.config = this.applyData.dataSource;
    const type = this.applyData.dataSource.type;
    const sql = StringUtils.format(this.configFactory.createConfig(type).getStatement('metadataManagementFetchTableData'),
      [this.applyData.database, this.applyData.table, 0, 100]);
    this.pluginFactory.createService(type)
      .getResponse(request, sql)
      .then(response => {
        if (response.status) {
          this.tableData = response.data;
        }
      });
  }
}
