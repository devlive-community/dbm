import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { ConfigModel } from '@renderer/model/config.model';
import { StringUtils } from '@renderer/utils/string.utils';
import { FilterModel } from '@renderer/model/filter.model';

@Component({
  selector: 'app-component-filter-database',
  templateUrl: './database.filter.component.html'
})
export class DatabaseFilterComponent extends BaseComponent {
  @Input()
  config: ConfigModel;
  @Output()
  emitter = new EventEmitter<any>();
  filter: FilterModel = new FilterModel();

  constructor() {
    super();
  }

  handlerValidate() {
    if (StringUtils.isNotEmpty(this.filter.value)) {
      this.disabled.button = false;
    } else {
      this.disabled.button = true;
    }
  }

  async handlerFilter() {
    this.config.status = true;
    this.config.filter = this.filter;
    this.emitter.emit(this.config);
  }
}
