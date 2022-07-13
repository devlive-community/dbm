import { AfterViewInit, Component } from "@angular/core";
import { DatasourceService } from "@renderer/services/management/datasource.service";
import { DatasourceModel } from "@renderer/model/datasource.model";
import { DatabaseService } from "@renderer/services/management/database.service";
import { RequestModel } from "@renderer/model/request.model";
import { TreeUtils } from "@renderer/utils/tree.utils";
import { TypeEnum } from "@renderer/enum/type.enum";
import { NzFormatEmitEvent } from "ng-zorro-antd/tree";
import { TableService } from "@renderer/services/management/table.service";
import { ColumnService } from "@renderer/services/management/column.service";
import { DatabaseModel } from "@renderer/model/database.model";
import { IconCommonService } from "@renderer/services/common/icon.common.service";
import { DatabaseEnum } from "@renderer/enum/database.enum";
import { MenuCommonService } from "@renderer/services/common/menu.common.service";
import { ConfigModel } from "@renderer/model/config.model";
import { OperationModel } from "@renderer/model/operation.model";
import { TableSheet } from "@antv/s2";
import { debounce } from 'lodash';
import { QueryService } from "@renderer/services/query/query.service";

@Component({
  selector: 'app-query-beta',
  templateUrl: 'query.beta.component.html',
  styleUrls: ['query.beta.component.scss']
})
export class QueryBetaComponent implements AfterViewInit {
  dataSpinning = {
    database: false,
    running: false
  }
  bodySize = {
    width: 100,
    height: 100
  }
  selectData = {
    currentValue: null,
    currentMenu: [],
    database: null,
    table: null,
    dataSource: null
  }
  isLoading: boolean = true;
  dataSources: DatasourceModel[] = new Array<DatasourceModel>();
  selectDataSourceNodes: any[] = [];
  requestConfig: RequestModel;
  applyEditor: string;
  config: any = {
    minLines: 10,
    maxLines: 10,
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
  };

  constructor(private datasourceService: DatasourceService,
              private databaseService: DatabaseService,
              private tableService: TableService,
              private columnService: ColumnService,
              private iconCommonService: IconCommonService,
              private menuCommonService: MenuCommonService,
              private queryService: QueryService) {
    this.datasourceService.getAll().then(data => {
      this.dataSources = data.filter(item => item.type === DatabaseEnum.clickhosue);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.handlerResize();
    }, 0);
  }

  handlerResize() {
    this.isLoading = true;
    new ResizeObserver(([entry] = []) => {
      const [size] = entry.borderBoxSize || [];
      this.bodySize.width = size.inlineSize - 18;
      this.bodySize.height = size.blockSize - 70 - 22;
      this.isLoading = false;
    }).observe(document.body);
  }

  handlerDataSourceChange(dataSource: string) {
    this.dataSpinning.database = true;
    this.datasourceService.findByAlias(dataSource)
      .then(response => {
        const request = new RequestModel();
        request.config = response;
        this.requestConfig = request;
        this.databaseService.getAll(request)
          .then(response => {
            if (response.status) {
              this.selectDataSourceNodes = TreeUtils.builderTreeNode(response.data.columns, TypeEnum.database);
            }
            this.dataSpinning.database = false;
          });
      });
  }

  handlerNodeLoad(event: NzFormatEmitEvent) {
    event.node.children = [];
    switch (event.node.level) {
      case 0:
        this.selectData.database = event.node.origin.key;
        this.tableService.getAll(this.requestConfig, event.node.origin.key)
          .then(response => {
            if (response.status) {
              event.node.addChildren(TreeUtils.builderTreeNode(response.data.columns, TypeEnum.table));
            } else {
              event.node.addChildren([]);
            }
          });
        break;
      case 1:
        this.selectData.table = event.node.origin.key;
        const databaseConfigure = new DatabaseModel();
        databaseConfigure.database = this.selectData.database;
        databaseConfigure.table = this.selectData.table;
        this.columnService.getAll(this.requestConfig, databaseConfigure)
          .then(response => {
            if (response.status) {
              event.node.addChildren(TreeUtils.builderTreeNode(response.data.columns, TypeEnum.column, true));
            } else {
              event.node.addChildren([]);
            }
          });
        break;
      default:
        event.node.addChildren([]);
    }
  }

  handlerNodeClick(event: NzFormatEmitEvent) {
    this.selectData.currentValue = event.node.origin;
    // Since the component is unselected when clicked again, we set it to selected by default
    if (!event.node.isSelected) {
      event.node.isSelected = true;
    }
  }

  handlerApplyIcon(type: TypeEnum) {
    return this.iconCommonService.applyIcon(type);
  }

  handlerVisibleChange(visible: boolean) {
    if (visible) {
      const configure = new ConfigModel();
      configure.database = this.selectData.database;
      configure.table = this.selectData.table;
      configure.value = this.selectData.currentValue.key;
      configure.request = this.requestConfig;
      this.selectData.currentMenu = this.menuCommonService.applyContextMenu(this.selectData.currentValue.type, configure);
    }
  }

  handlerCommand(command: OperationModel) {
    const configure = new ConfigModel();
    configure.database = this.selectData.database;
    configure.table = this.selectData.table;
    configure.value = this.selectData.currentValue.key;
    configure.request = this.requestConfig;
    this.menuCommonService.applySqlForOperation(command, configure);
  }

  handlerExecute() {
    this.dataSpinning.running = true;
    const container = document.getElementById('queryResultContainer');
    const queryEditorContainer = document.getElementById('queryEditorContainer');
    // Clear the last query result
    container.innerHTML = '';
    const s2Options = {
      width: this.bodySize.width - 207,
      height: this.bodySize.height - queryEditorContainer.offsetHeight,
    }
    this.datasourceService.findByAlias(this.selectData.dataSource)
      .then(currentDataSource => {
        const request = new RequestModel();
        request.config = currentDataSource;
        this.queryService.forward(request, this.applyEditor)
          .then(response => {
            if (response.status) {
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
                debounceRender(this.bodySize.width - 207, this.bodySize.height - queryEditorContainer.offsetHeight);
              }).observe(document.body);
              s2.render();
            } else {
              container.innerHTML = response.message;
            }
            this.dataSpinning.running = false;
          });
      });
  }
}
