export class ChartsModel {
  title: string;
  credits = false;
  type = 'line';
  legend = false;
  series: ChartsSeriesModel[] = new Array();
  xAxis: ChartsCategoriesModel = new ChartsCategoriesModel();
}

export class ChartsSeriesModel {
  name: string;
  data: number[] = new Array();
}

export class ChartsCategoriesModel {
  categories: string[] = new Array();
}
