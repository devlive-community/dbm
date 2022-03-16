import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { OperationEnum } from '@renderer/enum/operation.enum';
import { ConfigModel } from '@renderer/model/config.model';
import { MenuModel } from '@renderer/model/menu.model';

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
  value: any;
  @Input()
  database: string;
  @Input()
  menu: MenuModel;
  @Output()
  emitter = new EventEmitter<ConfigModel>();
  current = 0;
  operation = OperationEnum;

  handlerCancel() {
    this.config.status = false;
    this.emitter.emit(this.config);
  }

  handlerEmitter(event: ConfigModel) {
    this.config.menu = this.menu;
    this.config.currentNode = this.value;
    this.emitter.emit(event);
  }
}
