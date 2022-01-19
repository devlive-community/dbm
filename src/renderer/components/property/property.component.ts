import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { PropertyModel } from '@renderer/model/property.model';
import { StringUtils } from '@renderer/utils/string.utils';

@Component({
  selector: 'app-component-property',
  templateUrl: './property.component.html'
})
export class PropertyComponent extends BaseComponent {
  @Input()
  properties: PropertyModel[];
  @Output()
  emitter = new EventEmitter<any>();
  modelValues = [];
  property = {
    properties: [],
    validate: false
  };

  constructor() {
    super();
  }

  handlerValidate() {
    this.properties.forEach((element, index) => {
      element.value = this.modelValues[index];
    });
    this.property.properties = this.properties;
    const empty = Object.keys(this.property.properties).filter(item => StringUtils.isEmpty(this.property.properties[item].value));
    if (empty.length <= 0) {
      this.property.validate = true;
    } else {
      this.property.validate = false;
    }
    this.emitter.emit(this.property);
  }
}
