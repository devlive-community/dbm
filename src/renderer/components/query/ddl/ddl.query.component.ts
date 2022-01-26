import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { SqlUtils } from '@renderer/utils/sql.utils';
import { ClipboardComService } from '@renderer/services/other/clipboard.service';
import { EditorService } from '@renderer/services/editor/editor.service';
import { SystemEditorModel } from '@renderer/model/system.model';

@Component({
  selector: 'app-component-ddl-query',
  templateUrl: './ddl.query.component.html'
})
export class DdlQueryComponent extends BaseComponent {
  @Input()
  visible: boolean;
  @Input()
  text: string;
  @Output()
  emitter = new EventEmitter<any>();
  editorConfig: SystemEditorModel;

  constructor(private clipboardComService: ClipboardComService,
              private editorService: EditorService) {
    super();
    this.editorConfig = this.editorService.get();
  }

  handlerCancel() {
    this.visible = false;
    this.emitter.emit(this.visible);
  }

  handlerFormatter() {
    this.text = SqlUtils.formatter(this.text, this.editorConfig);
  }

  handlerCopy() {
    this.clipboardComService.copy(this.text);
  }
}
