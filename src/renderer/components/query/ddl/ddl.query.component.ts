import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { SqlUtils } from '@renderer/utils/sql.utils';
import { ClipboardComService } from '@renderer/services/other/clipboard.service';

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
  editorConfig = {
    mode: 'sql',
    readOnly: true
  };

  constructor(private clipboardComService: ClipboardComService) {
    super();
  }

  handlerCancel() {
    this.visible = false;
    this.emitter.emit(this.visible);
  }

  handlerFormatter() {
    this.text = SqlUtils.formatter(this.text);
  }

  handlerCopy() {
    this.clipboardComService.copy(this.text);
  }
}
