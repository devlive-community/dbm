import { Component, OnInit } from '@angular/core';
import { PackageUtils } from '@renderer/utils/package.utils';
import { ChartsModel, ChartsSeriesModel } from '@renderer/model/charts.model';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { QueryService } from '@renderer/services/query/query.service';
import { RequestModel } from '@renderer/model/request.model';
import { ClickhousePluginService } from '@renderer/services/plugin/clickhouse.plugin.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {
  version: string = PackageUtils.get('version');
  dataSources: any[];
  chartsConfig: ChartsModel[] = new Array();
  chartsSkeleton: boolean[] = new Array();

  constructor(private datasourceService: DatasourceService,
              private queryService: QueryService,
              private clickhousePluginService: ClickhousePluginService) {
    this.dataSources = this.datasourceService.getAll()?.data?.columns;
    for (let i = 0; i < this.chartsConfig.length; i++) {
      this.chartsSkeleton[i] = true;
    }
  }

  ngOnInit() {
    this.handlerInitChart();
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
          // this.chartOptions.xAxis.categories = this.items.map(v => v.categories)
          // this.chartOptions.series = [{
          //   name: this.title,
          //   data: this.items.map(v => v.value)
          // }]
          // for (const v of response.data.columns) {
          //   series.data.push(v.value);
          //   categories.push(v.categories);
          // }
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
