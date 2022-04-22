import { Component, OnInit } from '@angular/core';
import { PackageUtils } from '@renderer/utils/package.utils';
import { ChartsModel, ChartsSeriesModel } from '@renderer/model/charts.model';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { QueryService } from '@renderer/services/query/query.service';
import { RequestModel } from '@renderer/model/request.model';
import { ClickhousePluginService } from '@renderer/services/plugin/clickhouse.plugin.service';
import { DatasourceModel } from '@renderer/model/datasource.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {
  version: string = PackageUtils.get('version');
  dataSources: DatasourceModel[] = new Array();
  chartsConfig: ChartsModel[] = new Array();
  chartsSkeleton: boolean[] = new Array();

  constructor(private datasourceService: DatasourceService,
              private queryService: QueryService,
              private clickhousePluginService: ClickhousePluginService) {
    for (let i = 0; i < this.chartsConfig.length; i++) {
      this.chartsSkeleton[i] = true;
    }
  }

  ngOnInit() {
    this.datasourceService.getAll().then(response => {
      this.dataSources = response;
      this.handlerInitChart();
    });
  }

  handlerInitChart() {
    this.dataSources.forEach((value, index) => {
      const request = new RequestModel();
      request.config = value;
      this.clickhousePluginService.getQueryCount(request).then(response => {
        if (response.status) {
          const config = new ChartsModel();
          config.type = 'area';
          const series = new ChartsSeriesModel();
          config.xAxis.categories = response.data.columns.map(v => v.categories);
          series.data = response.data.columns.map(v => v.value);
          series.name = 'Count';
          config.series.push(series);
          this.chartsConfig[index] = config;
        }
        this.chartsSkeleton[index] = false;
      });
    });
  }
}
