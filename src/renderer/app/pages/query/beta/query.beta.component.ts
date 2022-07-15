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
import { QueryService } from "@renderer/services/query/query.service";
import { ObjectUtils } from "@renderer/utils/object.utils";
import { TranslateService } from "@ngx-translate/core";
import { NzModalService } from "ng-zorro-antd/modal";

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
  applyEditor = {
    value: null,
    configuration: {
      minLines: 10,
      maxLines: 10,
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true
    }
  };
  applyResult = {
    headers: [],
    columns: [],
    message: null,
    height: 0,
    width: 0
  };
  applyClickType = TypeEnum;
  applyClick = {
    type: TypeEnum.column,
    value: null,
    header: null
  }

  constructor(private transactionService: TranslateService,
              private modalService: NzModalService,
              private datasourceService: DatasourceService,
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
    // Cleared the last query data
    this.applyResult.headers = [];
    this.applyResult.columns = [];
    this.applyResult.message = null;

    new ResizeObserver(([entry] = []) => {
      // Subtract the default bottom page height
      const queryEditorContainer = document.getElementById('queryEditorContainer');
      if (ObjectUtils.isNotNull(queryEditorContainer)) {
        this.applyResult.height = this.bodySize.height - queryEditorContainer.offsetHeight - 100;
        this.applyResult.width = queryEditorContainer.offsetWidth;
      }
    }).observe(document.body);

    this.datasourceService.findByAlias(this.selectData.dataSource)
      .then(currentDataSource => {
        const request = new RequestModel();
        request.config = currentDataSource;
        this.queryService.forward(request, this.applyEditor.value)
          .then(response => {
            if (response.status) {
              this.applyResult.headers = response.data.headers;
              this.applyResult.columns = response.data.columns;
            } else {
              this.applyResult.message = response.message;
            }
            this.dataSpinning.running = false;
          });
      });
  }

  handlerShowMoreEllipsis() {
    this.modalService.error({
      nzWidth: '80%',
      nzKeyboard: false,
      nzMaskClosable: false,
      nzOkText: this.transactionService.instant('common.ok'),
      nzContent: this.applyResult.message
    });
  }

  handlerCellClick(cellType: TypeEnum, header: string, value: string) {
    this.applyClick.type = cellType;
    this.applyClick.header = header;
    this.applyClick.value = value;
  }

  handlerShowFullValue() {
    this.modalService.info({
      nzWidth: '80%',
      nzKeyboard: false,
      nzMaskClosable: false,
      nzOkText: this.transactionService.instant('common.ok'),
      nzContent: this.applyClick.value.toString()
    });
  }
}
