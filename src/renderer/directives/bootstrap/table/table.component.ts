import { AfterContentInit, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-directive-bootstrap-table',
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit, AfterContentInit {
  @Input()
  headers: any[];
  @Input()
  columns: any[];
  @Input()
  statistics: any;
  @Input()
  showIndex = true;
  page = {
    current: 1,
    size: 10,
    cache: []
  };

  constructor() {
    this.page.cache = this.columns;
  }

  ngAfterContentInit(): void {
    this.handlerPageChanged({
      page: 1,
      itemsPerPage: this.page.size
    });
  }

  ngOnInit(): void {
  }

  handlerPageChanged(event: any) {
    this.page.current = event.page;
    this.page.cache = this.columns.slice((this.page.current - 1) * this.page.size, this.page.current * this.page.size);
  }

  handlerFlatJson(json) {
    return Object.keys(json);
  }
}
