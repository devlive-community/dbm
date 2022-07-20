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
import { DatabaseEnum } from "@renderer/enum/database.enum";

@Component({
  selector: 'app-monitor-processor',
  templateUrl: 'monitor.processor.component.html'
})
export class MonitorProcessorComponent extends BaseComponent implements OnDestroy {
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
  currentDataSource: DatasourceModel;
  currentProcessor: any;
  inputValue: string;
  stopLoading: boolean = false;

  constructor(private datasourceService: DatasourceService,
              private monitorService: MonitorService,
              private messageService: NzMessageService) {
    super();
    this.datasourceService.getAll().then(response => {
      this.dataSources = response.map(item => {
        if (item.type === DatabaseEnum.postgresql || item.type === DatabaseEnum.druid) {
          item.status = false;
        }
        return item;
      });
    });
  }

  async handlerSwitch() {
    this.loading.button = true;
    this.processors = null;
    const request = new RequestModel();
    this.currentDataSource = await this.datasourceService.getByAliasAsync(this.threshold.datasource);
    request.config = this.currentDataSource;
    this.monitorService.getProcesses(request).then(response => {
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

  handlerShowModal(item: BaseModel, type?: string) {
    this.currentProcessor = item;
    if (type) {
      this.disabled.dialog = true;
      this.queryDDL = item['query'];
    } else {
      this.dialog.stop = true;
    }
  }

  handlerCloseModal(type?: string) {
    this.currentProcessor = null;
    if (type) {
      this.disabled.dialog = false;
    } else {
      this.dialog.stop = false;
      this.stopLoading = false;
    }
  }

  handlerInitChart(response) {
    this.chartsConfig = new ChartsModel();
    this.chartsConfig.type = 'area';
    const series = new ChartsSeriesModel();
    const data = new Array();
    data.push(response.data.columns.length);
    series.data = data;
    series.name = 'Count';
    this.chartsConfig.series.push(series);
  }

  handlerValidate() {
    if (this.inputValue === this.currentProcessor?.id) {
      this.disabled.button = false;
    } else {
      this.disabled.button = true;
    }
  }

  handlerQuicklyEnter() {
    this.inputValue = this.currentProcessor?.id;
    this.handlerValidate();
  }

  handlerStop() {
    this.stopLoading = true;
    const request = new RequestModel();
    request.config = this.currentDataSource;
    this.monitorService.stop(request, this.inputValue).then(response => {
      if (response.status) {
        this.messageService.success(response.message);
        this.handlerCloseModal();
      } else {
        this.messageService.error(response.message);
      }
      this.stopLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
