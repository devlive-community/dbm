import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { DatasourceModel } from "@renderer/model/datasource.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-component-datasource-druid',
  templateUrl: './datasource.druid.component.html'
})
export class DatasourceDruidComponent extends BaseComponent {
  @Input()
  configure: DatasourceModel;
  @Output()
  emitterValue = new EventEmitter<any>();
  validateForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    super();
    this.validateForm = this.formBuilder.group({
      alias: [null, [Validators.required]],
      host: [null, [Validators.required]],
      port: [null, [Validators.required]]
    });
  }

  handlerValidate() {
    if (this.validateForm.valid) {
      this.configure.validate = true;
      this.configure.url = 'druid/v2/sql';
      this.emitterValue.emit(this.configure);
    } else {
      this.configure.validate = false;
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }

  handlerEmitterValue() {
    this.handlerValidate();
  }
}
