import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { DatasourceModel } from "@renderer/model/datasource.model";
import { DatabaseEnum } from "@renderer/enum/database.enum";

@Component({
  selector: 'app-component-datasource-common',
  templateUrl: './datasource.common.component.html'
})
export class DatasourceCommonComponent extends BaseComponent {
  @Input()
  configure: DatasourceModel;
  @Output()
  emitterValue = new EventEmitter<any>();
  datasourceType = DatabaseEnum;

  constructor() {
    super();
  }

  handlerEmitterValue(emitterValue: DatasourceModel) {
    this.emitterValue.emit(emitterValue);
  }
}
