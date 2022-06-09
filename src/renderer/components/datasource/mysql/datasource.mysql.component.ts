import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { DatasourceModel } from "@renderer/model/datasource.model";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-component-datasource-mysql',
  templateUrl: './datasource.mysql.component.html'
})
export class DatasourceMysqlComponent extends BaseComponent implements AfterViewInit {
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
      port: [null, [Validators.required]],
      authorization: [null, [Validators.required]],
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      database: [null, [Validators.required]]
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.configure.authorization = true;
      this.configure.port = 3306;
    }, 0);
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

  handlerEmitterValue() {
    this.handlerValidate();
  }
}
