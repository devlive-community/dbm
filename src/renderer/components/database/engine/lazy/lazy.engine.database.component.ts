import { Component, EventEmitter, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';

@Component({
  selector: 'app-component-database-engine-lazy',
  templateUrl: './lazy.engine.database.component.html'
})
export class LazyEngineDatabaseComponent extends BaseComponent {
  @Output()
  emitter = new EventEmitter<any>();
  property = {
    timeSeconds: 0,
    validate: false
  };

  constructor() {
    super();
  }

  handlerValidate() {
    if (this.property.timeSeconds > 0) {
      this.property.validate = true;
    } else {
      this.property.validate = false;
    }
    this.emitter.emit(this.property);
  }
}
