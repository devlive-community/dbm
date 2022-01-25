import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { ConfigModel } from '@renderer/model/config.model';

@Component({
  selector: 'app-component-common-table',
  templateUrl: './common.table.component.html'
})
export class CommonTableComponent extends BaseComponent {
  @Input()
  visible: boolean;
  @Input()
  config: ConfigModel;
  @Input()
  value: string;
  @Output()
  emitter = new EventEmitter<any>();
  current = 0;

  handlerCancel() {
    this.visible = false;
    this.emitter.emit(this.visible);
  }

  handlerEmitter(event: boolean) {
    this.visible = event;
    this.emitter.emit(this.visible);
  }
}
