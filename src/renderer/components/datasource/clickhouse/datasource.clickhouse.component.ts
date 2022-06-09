import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { DatasourceModel } from "@renderer/model/datasource.model";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-component-datasource-clickhouse',
  templateUrl: './datasource.clickhouse.component.html'
})
export class DatasourceClickHouseComponent extends BaseComponent {
  @Input()
  configure: DatasourceModel;
  @Output()
  emitterValue = new EventEmitter<any>();
  validateForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    super();
    this.validateForm = this.formBuilder.group({
      alias: [null, [Validators.required]],
      protocol: [null, [Validators.required]],
      host: [null, [Validators.required]],
      port: [null, [Validators.required]],
      authorization: [null, [Validators.required]],
      database: [null, []]
    });
  }

  handlerValidate() {
    if (this.validateForm.valid) {
      this.configure.validate = true;
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

  handlerAuthorization() {
    if (this.configure.authorization) {
      this.validateForm.addControl('username', new FormControl(null, [Validators.required]));
      this.validateForm.addControl('password', new FormControl(null, [Validators.required]));
    } else {
      this.validateForm.removeControl('username');
      this.validateForm.removeControl('password');
    }
    this.handlerValidate();
  }

  handlerEmitterValue() {
    this.handlerValidate();
  }
}
