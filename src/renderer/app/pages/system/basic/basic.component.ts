import { Component } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { SystemBasicModel } from '@renderer/model/system.model';
import { BasicService } from '@renderer/services/system/basic.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-system.basic',
  templateUrl: 'basic.component.html'
})
export class BasicComponent extends BaseComponent {
  model: SystemBasicModel;

  constructor(private basicService: BasicService,
              private messageService: NzMessageService) {
    super();
    this.model = this.basicService.get() === null ? new SystemBasicModel() : this.basicService.get();
  }

  handlerSave() {
    this.basicService.save(this.model);
    this.messageService.success('Save Successful!');
  }
}
