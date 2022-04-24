import { AfterViewInit, Component, Input } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { ExportToCsv } from 'export-to-csv';
import { StringUtils } from '@renderer/utils/string.utils';
import { TranslateService } from '@ngx-translate/core';
import { Md5 } from 'ts-md5';

const lodash = require('lodash');

@Component({
  selector: 'app-component-basic-table',
  templateUrl: './basic.table.component.html'
})
export class BasicTableComponent extends BaseComponent implements AfterViewInit {
  @Input()
  value: { headers: { name: string; value: string }[], columns: [] };
  public configuration: Config;
  public headers: Columns[] = new Array();
  public id: string;

  constructor(private translateService: TranslateService) {
    super();
    this.configuration = {...DefaultConfig};
    this.configuration.horizontalScroll = true;
    this.configuration.paginationRangeEnabled = false;
    this.configuration.searchEnabled = true;
    this.id = Md5.hashStr(new Date().toString());
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.value?.headers.forEach(column => {
        this.headers.push({key: column.name, title: column.name});
      });
    }, 0);
  }

  handlerExportToCSV(): void {
    const filename = StringUtils.format('{0}{1}-{2}',
      [this.translateService.instant('common.query'),
        this.translateService.instant('common.result'),
        lodash.now().toString()]);
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      useTextFile: false,
      useBom: true,
      filename: filename,
      useKeysAsHeaders: true
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(this.value.columns);
  }
}
