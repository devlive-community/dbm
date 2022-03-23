import { AfterViewInit, Component, Input } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';

const minAndMax = 3000;

@Component({
  selector: 'app-component-basic-table',
  templateUrl: './basic.table.component.html'
})
export class BasicTableComponent extends BaseComponent implements AfterViewInit {
  @Input()
  value: { headers: { name: string; value: string }[], columns: [] };
  public configuration: Config;
  public headers: Columns[] = new Array();

  constructor() {
    super();
    this.configuration = {...DefaultConfig};
    this.configuration.horizontalScroll = true;
    this.configuration.paginationRangeEnabled = false;
    this.configuration.searchEnabled = true;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.value.headers.forEach(column => {
        this.headers.push({key: column.name, title: column.name});
      });
    }, 0);
  }

  handlerAnalysisWidth(): number {
    let width = this.value?.columns.length * 100 + 360;
    if (width > minAndMax) {
      width = minAndMax;
    }
    return width;
  }
}
