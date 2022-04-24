import { AfterViewInit, Component, Input } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { ConfigModel } from '@renderer/model/config.model';
import { DatabaseModel } from '@renderer/model/database.model';
import { RequestModel } from '@renderer/model/request.model';
import { ResponseDataModel } from '@renderer/model/response.model';
import { ColumnService } from '@renderer/services/management/column.service';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-component-preview-column',
  templateUrl: './column.preview.component.html'
})
export class PreviewColumnComponent extends BaseComponent implements AfterViewInit {
  @Input()
  config: ConfigModel;
  @Input()
  value: string;
  @Input()
  database: string;
  @Input()
  table: string;
  tableData: ResponseDataModel;

  constructor(private dataSourceService: DatasourceService,
              private columnService: ColumnService,
              private messageService: NzMessageService) {
    super();
  }

  async ngAfterViewInit() {
    const request = new RequestModel();
    request.config = await this.dataSourceService.getByAliasAsync(this.config.value);
    const _value = new DatabaseModel();
    _value.database = this.database;
    _value.table = this.table;
    _value.name = this.value;
    this.columnService.getPreview(request, _value).then(response => {
      if (response.status) {
        this.tableData = response.data;
      } else {
        this.messageService.error(response.message);
      }
    });
  }
}
