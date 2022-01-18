import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { DatabaseConfig } from '@renderer/config/database.config';
import { ConfigModel } from '@renderer/model/config.model';
import { DatabaseModel } from '@renderer/model/database.model';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { MetadataService } from '@renderer/services/management/metadata.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StringUtils } from "@renderer/utils/string.utils";
import { RequestModel } from '@renderer/model/request.model';

@Component({
  selector: 'app-component-database',
  templateUrl: './database.basic.component.html'
})
export class DatabaseBasicComponent extends BaseComponent implements AfterViewInit {
  @Input()
  visible: boolean;
  @Input()
  config: ConfigModel;
  @Output()
  emitter = new EventEmitter<any>();

  current = 0;
  databaseEngines: DatabaseModel[];
  configure: DatabaseModel;

  constructor(private dataSourceService: DatasourceService,
    private metadataService: MetadataService,
    private messageService: NzMessageService) {
    super();
    this.databaseEngines = new DatabaseConfig().getConfig();
    this.configure = new DatabaseModel();
  }

  ngAfterViewInit(): void {
  }

  handlerCancel() {
    this.visible = false;
    this.emitter.emit(this.visible);
  }

  handlerPrevious(): void {
    this.current -= 1;
  }

  handlerNext(): void {
    this.current += 1;
  }

  handlerValidate() {
    if (StringUtils.isNotEmpty(this.configure.name)) {
      this.disabled.button = false;
    } else {
      this.disabled.button = true;
    }
  }

  handlerComplete(): void {
    const request = new RequestModel();
    request.config = this.dataSourceService.getAll(this.config.value)?.data?.columns[0];
    this.metadataService.createDatabase(request, this.configure).then(response => {
      if (response.status) {
        this.messageService.success(response.message);
        this.handlerCancel();
      } else {
        this.messageService.error(response.message);
      }
    });
  }
}
