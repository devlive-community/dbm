import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { ConfigModel } from '@renderer/model/config.model';
import { DatabaseModel } from '@renderer/model/database.model';
import { RequestModel } from '@renderer/model/request.model';
import { ColumnService } from '@renderer/services/management/column.service';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { StringUtils } from '@renderer/utils/string.utils';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'app-component-rename-column',
    templateUrl: './column.rename.component.html'
})
export class RenameColumnComponent extends BaseComponent {
    @Input()
    config: ConfigModel;
    @Input()
    value: string;
    @Input()
    database: string;
    @Input()
    table: string;
    @Output()
    emitter = new EventEmitter<any>();
    inputValue: string;

    constructor(private dataSourceService: DatasourceService,
        private columnService: ColumnService,
        private messageService: NzMessageService) {
        super();
    }

    handlerValidate() {
        if (StringUtils.isNotEmpty(this.inputValue) && this.inputValue !== this.value) {
            this.disabled.button = false;
        } else {
            this.disabled.button = true;
        }
    }

    async handlerRename() {
        this.loading.button = true;
        const request = new RequestModel();
        request.config = await this.dataSourceService.getByAliasAsync(this.config.value);
        const _value = new DatabaseModel();
        _value.database = this.database;
        _value.table = this.table;
        _value.name = this.value;
        this.columnService.rename(request, _value, this.inputValue).then(response => {
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
