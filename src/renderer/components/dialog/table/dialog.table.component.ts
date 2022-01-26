import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { ConfigModel } from '@renderer/model/config.model';

@Component({
  selector: 'app-component-dialog-table',
  templateUrl: './dialog.table.component.html'
})
export class TableDialogComponent extends BaseComponent {
  @Input()
  visible: boolean;
  @Input()
  config: ConfigModel;
  @Output()
  emitter = new EventEmitter<any>();

  constructor() {
    super();
  }

  handlerCancel() {
    this.visible = false;
    this.emitter.emit(this.visible);
  }
}
