import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { DatasourceModel } from "@renderer/model/datasource.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-component-datasource-protocol-ssh',
  templateUrl: './datasource.protocol.ssh.component.html'
})
export class DatasourceProtocolSshComponent extends BaseComponent implements AfterViewInit {
  @Input()
  configure: DatasourceModel;
  @Input()
  validateSSHForm!: FormGroup;
  @Output()
  emitterValue = new EventEmitter<any>();

  constructor(private formBuilder: FormBuilder) {
    super();
    this.validateSSHForm = this.formBuilder.group({
      sshHost: [null, [Validators.required]],
      sshPort: [null, [Validators.required]],
      sshUsername: [null, [Validators.required]],
      sshPassword: [null, [Validators.required]]
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.handlerValidate();
    }, 0);
  }

  handlerValidate() {
    if (this.validateSSHForm.valid) {
      this.configure.validate = true;
      this.emitterValue.emit(this.configure);
    } else {
      this.configure.validate = false;
      Object.values(this.validateSSHForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }
}
