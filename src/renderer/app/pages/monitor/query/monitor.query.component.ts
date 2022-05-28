import { Component } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { BaseModel } from '@renderer/model/base.model';
import { DatasourceModel } from '@renderer/model/datasource.model';
import { RequestModel } from '@renderer/model/request.model';
import { ResponseDataModel } from '@renderer/model/response.model';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { MonitorService } from '@renderer/services/monitor/monitor.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-monitor-query',
  templateUrl: 'monitor.query.component.html'
})
export class MonitorQueryComponent extends BaseComponent {
  threshold = {
    datasource: null,
    active: false,
    ranger: 500
  };
  dataSources: DatasourceModel[];
  processors: ResponseDataModel;
  queryDDL: string;

  constructor(private datasourceService: DatasourceService,
              private monitorService: MonitorService,
              private messageService: NzMessageService) {
    super();
    this.datasourceService.getAll().then(response => {
      this.dataSources = response;
    });
  }

  async handlerSwitch() {
    this.loading.button = true;
    this.processors = null;
    const request = new RequestModel();
    request.config = await this.datasourceService.getByAliasAsync(this.threshold.datasource);
    this.monitorService.getSlowQuery(request, this.threshold.ranger).then(response => {
      if (response.status) {
        this.processors = response.data;
      } else {
        this.messageService.error(response.message);
      }
      this.loading.button = false;
    });
  }

  handlerAnalysisWidth(): number {
    return this.processors?.columns.length + 360;
  }

  handlerFilterHeader(headers: any[]): any[] {
    return headers.filter(value => value.name !== 'query');
  }

  handlerShowDDL(item: BaseModel) {
    this.disabled.dialog = true;
    this.queryDDL = item['query'];
  }

  handlerCloseModal() {
    this.disabled.dialog = false;
  }
}
