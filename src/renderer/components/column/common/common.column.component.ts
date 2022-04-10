import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { OperationEnum } from '@renderer/enum/operation.enum';
import { ConfigModel } from '@renderer/model/config.model';
import { MenuModel } from '@renderer/model/menu.model';

@Component({
  selector: 'app-component-common-column',
  templateUrl: './common.column.component.html'
})
export class CommonColumnComponent extends BaseComponent {
  @Input()
  visible: boolean;
  @Input()
  config: ConfigModel;
  @Input()
  value: any;
  @Input()
  database: string;
  @Input()
  table: string;
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
    this.emitter.emit(this.config);
  }
}
