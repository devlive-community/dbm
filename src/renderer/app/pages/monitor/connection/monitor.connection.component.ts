import { Component, OnDestroy } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { DatasourceModel } from '@renderer/model/datasource.model';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { MonitorService } from '@renderer/services/monitor/monitor.service';
import { RequestModel } from '@renderer/model/request.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ResponseDataModel } from '@renderer/model/response.model';
import { BaseModel } from '@renderer/model/base.model';
import { ChartsModel, ChartsSeriesModel } from '@renderer/model/charts.model';

@Component({
  selector: 'app-monitor-connection',
  templateUrl: 'monitor.connection.component.html'
})
export class MonitorConnectionComponent extends BaseComponent implements OnDestroy {
  threshold = {
    datasource: null,
    active: false,
    ranger: 1
  };
  dataSources: DatasourceModel[];
  timer: any;
  processors: ResponseDataModel;
  queryDDL: string;
  chartsConfig: ChartsModel;

  constructor(private datasourceService: DatasourceService,
              private monitorService: MonitorService,
              private messageService: NzMessageService) {
    super();
    this.dataSources = this.datasourceService.getAll()?.data?.columns;
  }

  handlerSwitch() {
    this.loading.button = true;
    this.processors = null;
    const request = new RequestModel();
    request.config = this.datasourceService.getAll(this.threshold.datasource)?.data?.columns[0];
    this.monitorService.getConnections(request).then(response => {
      if (response.status) {
        this.processors = response.data;
        this.handlerInitChart(response);
      } else {
        this.messageService.error(response.message);
      }
      this.loading.button = false;
    });
  }

  handlerAuto() {
    if (this.threshold.active) {
      this.timer = setInterval(() => {
        this.handlerSwitch();
        //   this.refreshTime = (new Date()).valueOf();
      }, this.threshold.ranger * 1000);
    } else {
      clearInterval(this.timer);
    }
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

  handlerInitChart(response) {
    this.chartsConfig = new ChartsModel();
    this.chartsConfig.type = 'area';
    const series = new ChartsSeriesModel();
    this.chartsConfig.xAxis.categories = response.data.columns.map(v => v.categories);
    series.data = response.data.columns.map(v => v.value);
    series.name = 'Count';
    this.chartsConfig.series.push(series);
    console.log(JSON.stringify(this.chartsConfig));
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
