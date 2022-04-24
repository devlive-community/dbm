import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { ConfigModel } from '@renderer/model/config.model';
import { DatabaseModel } from '@renderer/model/database.model';
import { RequestModel } from '@renderer/model/request.model';
import { ColumnService } from '@renderer/services/management/column.service';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StringUtils } from '@renderer/utils/string.utils';

@Component({
  selector: 'app-component-comment-column',
  templateUrl: './column.comment.component.html'
})
export class CommentColumnComponent extends BaseComponent implements AfterViewInit {
  @Input()
  config: ConfigModel;
  @Input()
  value: string;
  @Input()
  database: string;
  @Input()
  table: string;
  @Output()
  emitter = new EventEmitter<ConfigModel>();
  inputValue: string;

  constructor(private dataSourceService: DatasourceService,
              private columnService: ColumnService,
              private messageService: NzMessageService) {
    super();
  }

  handlerValidate() {
    if (StringUtils.isNotEmpty(this.inputValue)) {
      this.disabled.button = false;
    } else {
      this.disabled.button = true;
    }
  }

  async handlerAddComment() {
    this.loading.button = true;
    const request = new RequestModel();
    request.config = await this.dataSourceService.getByAliasAsync(this.config.value);
    const _value = new DatabaseModel();
    _value.database = this.database;
    _value.table = this.table;
    _value.name = this.value;
    this.columnService.comment(request, _value, this.inputValue).then(response => {
      if (response.status) {
        this.messageService.success(response.message);
        this.config.status = false;
        this.emitter.emit(this.config);
      } else {
        this.messageService.error(response.message);
      }
      this.loading.button = false;
    });
  }

  ngAfterViewInit(): void {
  }
}
