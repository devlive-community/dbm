import { AfterViewInit, Component, Input } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { ConfigModel } from '@renderer/model/config.model';
import { DatabaseModel } from '@renderer/model/database.model';
import { RequestModel } from '@renderer/model/request.model';
import { ResponseDataModel } from '@renderer/model/response.model';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { TableService } from '@renderer/services/management/table.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-component-preview-table',
  templateUrl: './table.preview.component.html'
})
export class PreviewTableComponent extends BaseComponent implements AfterViewInit {
  @Input()
  config: ConfigModel;
  @Input()
  value: string;
  @Input()
  database: string;
  tableData: ResponseDataModel;

  constructor(private dataSourceService: DatasourceService,
              private tableService: TableService,
              private messageService: NzMessageService) {
    super();
  }

  async ngAfterViewInit() {
    const request = new RequestModel();
    request.config = await this.dataSourceService.getByAliasAsync(this.config.value);
    const _value = new DatabaseModel();
    _value.database = this.database;
    _value.name = this.value;
    this.tableService.getPreview(request, _value).then(response => {
      if (response.status) {
        this.tableData = response.data;
      } else {
        this.messageService.error(response.message);
      }
    });
  }
}
