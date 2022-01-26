import { Component, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { ConfigModel } from '@renderer/model/config.model';
import { DatabaseModel } from '@renderer/model/database.model';
import { RequestModel } from '@renderer/model/request.model';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { TableService } from '@renderer/services/management/table.service';
import { StringUtils } from '@renderer/utils/string.utils';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'app-component-clean-table',
    templateUrl: './table.clean.component.html'
})
export class CleanTableComponent extends BaseComponent implements AfterViewInit {
    @Input()
    config: ConfigModel;
    @Input()
    value: string;
    @Input()
    database: string;
    @Output()
    emitter = new EventEmitter<any>();
    inputValue: string;
    partitions: any[];

    constructor(private dataSourceService: DatasourceService,
        private tableService: TableService,
        private messageService: NzMessageService) {
        super();
    }

    ngAfterViewInit(): void {
        const request = new RequestModel();
        request.config = this.dataSourceService.getAll(this.config.value)?.data?.columns[0];
        const _value = new DatabaseModel();
        _value.database = this.database;
        _value.name = this.value;
        this.tableService.getPartitions(request, _value).then(response => {
            if (response.status) {
                this.partitions = response.data.columns;
            } else {
                this.messageService.error(response.message);
            }
        });
    }

    handlerValidate() {
        if (StringUtils.isNotEmpty(this.inputValue)) {
            this.disabled.button = false;
        } else {
            this.disabled.button = true;
        }
    }

    handlerClean() {
        this.loading.button = true;
        const request = new RequestModel();
        request.config = this.dataSourceService.getAll(this.config.value)?.data?.columns[0];
        const _value = new DatabaseModel();
        _value.database = this.database;
        _value.name = this.value;
        this.tableService.clean(request, _value, this.inputValue).then(response => {
            if (response.status) {
                this.messageService.success(response.message);
                this.emitter.emit(true);
            } else {
                this.messageService.error(response.message);
            }
            this.loading.button = false;
        });
    }
}
