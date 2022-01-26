import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { ConfigModel } from '@renderer/model/config.model';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { MetadataService } from '@renderer/services/management/metadata.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestModel } from '@renderer/model/request.model';

@Component({
  selector: 'app-component-database-drop',
  templateUrl: './database.drop.component.html'
})
export class DatabaseDropComponent extends BaseComponent {
  @Input()
  visible: boolean;
  @Input()
  config: ConfigModel;
  @Input()
  value: string;
  @Output()
  emitter = new EventEmitter<any>();
  inputValue: string;

  constructor(private dataSourceService: DatasourceService,
              private metadataService: MetadataService,
              private messageService: NzMessageService) {
    super();
  }

  handlerCancel() {
    this.visible = false;
    this.emitter.emit(this.visible);
  }

  handlerValidate() {
    if (this.inputValue === this.value) {
      this.disabled.button = false;
    } else {
      this.disabled.button = true;
    }
  }

  handlerDelete() {
    this.loading.button = true;
    const request = new RequestModel();
    request.config = this.dataSourceService.getAll(this.config.value)?.data?.columns[0];
    this.metadataService.delete(request, this.value).then(response => {
      if (response.status) {
        this.messageService.success(response.message);
        this.handlerCancel();
      } else {
        this.messageService.error(response.message);
      }
      this.loading.button = false;
    });
  }
}
