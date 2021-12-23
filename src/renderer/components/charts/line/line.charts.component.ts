import { Component, Input, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { ChartsModel } from '@renderer/model/charts.model';

@Component({
  selector: 'app-component-charts-line',
  templateUrl: 'line.charts.component.html'
})
export class LineChartsComponent implements OnInit {
  @Input()
  private config: ChartsModel;
  chart: Chart;

  ngOnInit(): void {
    const chartConfig = {
      chart: {type: this.config.type},
      title: {text: this.config.title},
      legend: {enabled: this.config.legend},
      credits: {enabled: this.config.credits},
      series: [],
      xAxis: {categories: []}
    };
    chartConfig.series = this.config.series;
    if (this.config.xAxis?.categories) {
      chartConfig.xAxis.categories = this.config.xAxis.categories;
    }
    this.chart = new Chart(chartConfig);
  }
}
