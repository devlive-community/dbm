import { AfterViewInit, Component, Input } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { ExportToCsv } from 'export-to-csv';
import { Md5 } from 'ts-md5';
import { TableExportModel } from "@renderer/components/table/basic/table.export.model";
import { StringUtils } from "@renderer/utils/string.utils";
import { TranslateService } from "@ngx-translate/core";
import { NzModalService } from "ng-zorro-antd/modal";

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
  exportInfo: TableExportModel;

  constructor(private translateService: TranslateService,
              private modalService: NzModalService) {
    super();
    this.configuration = {...DefaultConfig};
    this.configuration.horizontalScroll = true;
    this.configuration.paginationRangeEnabled = false;
    this.configuration.searchEnabled = true;
    this.id = Md5.hashStr(new Date().toString());
    this.exportInfo = new TableExportModel()
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.value?.headers.forEach(column => {
        this.headers.push({key: column.name, title: column.name});
      });
      this.handlerValidate();
    }, 0);
  }

  handlerValidate() {
    if (StringUtils.isNotEmpty(this.exportInfo.name)) {
      this.disabled.button = false;
    } else {
      this.disabled.button = true;
    }
  }

  handlerDialog(isClose: boolean = false): void {
    if (isClose) {
      this.dialog.create = true;
    } else {
      this.dialog.create = false;
    }
  }

  handlerExportToCSV(): void {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      useTextFile: false,
      useBom: true,
      filename: this.exportInfo.name,
      useKeysAsHeaders: true
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(this.value.columns);
  }

  handlerShowMoreEllipsis(value: any): void {
    this.modalService.info({
      nzWidth: '80%',
      nzKeyboard: false,
      nzMaskClosable: false,
      nzOkText: this.translateService.instant('common.ok'),
      nzContent: value.toString()
    });
  }
}
