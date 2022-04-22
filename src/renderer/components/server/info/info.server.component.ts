import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { ConfigModel } from '@renderer/model/config.model';
import { RequestModel } from '@renderer/model/request.model';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { MetadataService } from '@renderer/services/management/metadata.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-component-info-server',
  templateUrl: './info.server.component.html'
})
export class InfoServerComponent extends BaseComponent implements AfterViewInit {
  @Input()
  visible: boolean;
  @Input()
  config: ConfigModel;
  @Output()
  emitter = new EventEmitter<any>();
  items: any;

  constructor(private dataSourceService: DatasourceService,
              private metadataService: MetadataService,
              private messageService: NzMessageService) {
    super();
  }

  handlerCancel() {
    this.visible = false;
    this.emitter.emit(this.visible);
  }

  async ngAfterViewInit() {
    setTimeout(async () => {
      const request = new RequestModel();
      request.config = await this.dataSourceService.getByAliasAsync(this.config.value);
      this.disabled.dialog = true;
      this.metadataService.getInfo(request).then(response => {
        if (response.status) {
          this.items = response.data;
        } else {
          this.messageService.error(response.message);
        }
        this.disabled.dialog = false;
      });
    }, 0);
  }
}
