import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { ConfigModel } from '@renderer/model/config.model';
import { DatabaseModel } from '@renderer/model/database.model';
import { RequestModel } from '@renderer/model/request.model';
import { SystemEditorModel } from '@renderer/model/system.model';
import { EditorService } from '@renderer/services/editor/editor.service';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { TableService } from '@renderer/services/management/table.service';
import { ClipboardComService } from '@renderer/services/other/clipboard.service';
import { SqlUtils } from '@renderer/utils/sql.utils';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-component-structure-table',
  templateUrl: './table.structure.component.html'
})
export class StructureTableComponent extends BaseComponent implements AfterViewInit {
  @Input()
  config: ConfigModel;
  @Input()
  value: string;
  @Input()
  database: string;
  @Output()
  emitter = new EventEmitter<any>();
  structure: string;
  editorConfig: SystemEditorModel;

  constructor(private dataSourceService: DatasourceService,
    private tableService: TableService,
    private messageService: NzMessageService,
    private clipboardComService: ClipboardComService,
    private editorService: EditorService) {
    super();
    this.editorConfig = this.editorService.get();
  }

  ngAfterViewInit(): void {
    // eslint-disable-next-line max-len
    // Fix ERROR Error: NG0100: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'false'. Current value: 'true'
    setTimeout(() => {
      this.handlerInitialize();
    }, 0);
  }

  handlerCancel() {
    this.emitter.emit(true);
  }

  async handlerInitialize() {
    this.loading.button = true;
    const request = new RequestModel();
    request.config = await this.dataSourceService.getByAliasAsync(this.config.value);
    const _value = new DatabaseModel();
    _value.database = this.database;
    _value.name = this.value;
    this.tableService.getCreateStatement(request, _value).then(response => {
      if (response.status) {
        this.structure = response?.data?.columns[0]?.statement;
      } else {
        this.messageService.error(response.message);
      }
      this.loading.button = false;
    });
  }

  handlerFormatter() {
    this.structure = SqlUtils.formatter(this.structure, this.editorConfig);
  }

  handlerCopy() {
    this.clipboardComService.copy(this.structure);
  }
}
