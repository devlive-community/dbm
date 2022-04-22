import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { ConfigModel } from '@renderer/model/config.model';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { MetadataService } from '@renderer/services/management/metadata.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestModel } from '@renderer/model/request.model';
import { ClipboardComService } from '@renderer/services/other/clipboard.service';
import { EditorService } from '@renderer/services/editor/editor.service';
import { SystemEditorModel } from '@renderer/model/system.model';
import { SqlUtils } from '@renderer/utils/sql.utils';

@Component({
  selector: 'app-component-database-structure',
  templateUrl: './database.structure.component.html'
})
export class DatabaseStructureComponent extends BaseComponent implements AfterViewInit {
  @Input()
  visible: boolean;
  @Input()
  config: ConfigModel;
  @Input()
  value: string;
  @Output()
  emitter = new EventEmitter<any>();
  structure: string;
  editorConfig: SystemEditorModel;

  constructor(private dataSourceService: DatasourceService,
              private metadataService: MetadataService,
              private messageService: NzMessageService,
              private clipboardComService: ClipboardComService,
              private editorService: EditorService) {
    super();
    this.editorConfig = this.editorService.get();
  }

  ngAfterViewInit(): void {
    // eslint-disable-next-line max-len
    // Fix Error: NG0100: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'false'. Current value: 'true'
    setTimeout(() => {
      this.handlerInitialize();
    }, 0);
  }

  handlerCancel() {
    this.visible = false;
    this.emitter.emit(this.visible);
  }

  async handlerInitialize() {
    this.loading.button = true;
    const request = new RequestModel();
    request.config = await this.dataSourceService.getByAliasAsync(this.config.value);
    this.metadataService.getDatabaseDDL(request, this.value).then(response => {
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
