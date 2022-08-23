import { AfterViewInit, Component } from "@angular/core";
import { RequestModel } from "@renderer/model/request.model";
import { TreeUtils } from "@renderer/utils/tree.utils";
import { TypeEnum } from "@renderer/enum/type.enum";
import { DatasourceService } from "@renderer/services/management/datasource.service";
import { DatabaseService } from "@renderer/services/management/database.service";
import { NzFormatEmitEvent } from "ng-zorro-antd/tree";
import { IconCommonService } from "@renderer/services/common/icon.common.service";
import { TableService } from "@renderer/services/management/table.service";
import { DesignerApplyData } from "@renderer/app/views/object_designer/model/designer.apply.data";

const _ = require("lodash");

@Component({
  selector: 'object-designer',
  templateUrl: 'designer.view.html',
  styleUrls: ['designer.style.scss']
})
export class DesignerComponent implements AfterViewInit{
  applyDataForArray = {
    databases: []
  }
  applyData = new DesignerApplyData();
  loading = {
    database: false
  }

  constructor(private dataSourceService: DatasourceService,
              private databaseService: DatabaseService,
              private tableService: TableService,
              private iconCommonService: IconCommonService) {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.handlerResize();
    }, 0);
  }

  handlerResize() {
    new ResizeObserver(([entry] = []) => {
      const [size] = entry.borderBoxSize || [];
      this.applyData.width = size.inlineSize - 18;
      this.applyData.height = size.blockSize - 130;
    }).observe(document.body);
  }

  /**
   * After the data source detects changes, refresh all databases of the data source
   * @param value Selected data source
   */
  handlerDataSource(value: string): void {
    this.loading.database = true;
    this.dataSourceService.findByAlias(value)
      .then(response => {
        this.applyData.dataSource = response;
        const request = new RequestModel();
        request.config = response;
        this.databaseService.getAll(request)
          .then(response => {
            if (response.status) {
              this.applyDataForArray.databases = TreeUtils.builderTreeNode(response.data.columns, TypeEnum.database);
            }
            this.loading.database = false;
          });
      });
  }

  handlerNodeLoad(event: NzFormatEmitEvent) {
    const requestConfigure = new RequestModel();
    requestConfigure.config = this.applyData.dataSource;
    this.applyData.currentValue = event.node.origin.key;
    event.node.children = [];
    switch (event.node.level) {
      case 0:
        this.applyData.database = event.node.origin.key;
        this.tableService.getAll(requestConfigure, event.node.origin.key)
          .then(response => {
            if (response.status) {
              event.node.addChildren(TreeUtils.builderTreeNode(response.data.columns, TypeEnum.table));
            } else {
              event.node.addChildren([]);
            }
            this.applyData.isOpen = true;
          });
        break;
      default:
        event.node.addChildren([]);
    }
  }

  handlerNodeClick(event: NzFormatEmitEvent) {
    if (this.applyData.isOpen && (this.applyData.currentValue !== event.node.origin.key)) {
      this.applyData.isOpen = false;
    }
    // Since the component is unselected when clicked again, we set it to selected by default
    if (!event.node.isSelected) {
      event.node.isSelected = true;
    }
    if (event.node.level === 0) {
      this.applyData.type = TypeEnum.database;
    } else {
      this.applyData.type = TypeEnum.table;
    }
  }

  handlerApplyIcon(type: TypeEnum) {
    return this.iconCommonService.applyIcon(type);
  }
}
