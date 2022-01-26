import { Component } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { DatasourceModel } from '@renderer/model/datasource.model';
import { TrackService } from '@renderer/services/tools/track.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TrackEnum } from '@renderer/enum/track.enum';
import { ColorEnum } from '@renderer/enum/color.enum';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DatabaseService } from '@renderer/services/management/database.service';
import { RequestModel } from '@renderer/model/request.model';
import { TableService } from '@renderer/services/management/table.service';
import { MigrateService } from '@renderer/services/tools/migrate.service';

@Component({
    selector: 'app-tools-migrte',
    templateUrl: 'migrte.component.html'
})
export class MigrteComponent extends BaseComponent {
    dataSources: DatasourceModel[];
    source = { datasource: null, databases: [], database: null, tables: [], table: null };
    target = { datasource: null, databases: [], database: null, tables: [], table: null };

    constructor(private datasourceService: DatasourceService,
        private databaseService: DatabaseService,
        private messageService: NzMessageService,
        private tableService: TableService,
        private migrateService: MigrateService) {
        super();
        this.dataSources = this.datasourceService.getAll()?.data?.columns;
    }

    handlerSwitchSource(type: boolean) {
        this.databaseService.getAll(this.handlerRequest(type)).then(response => {
            if (response.status) {
                if (type) {
                    this.source.databases = response.data.columns;
                } else {
                    this.target.databases = response.data.columns;
                }
            } else {
                this.messageService.error(response.message);
            }
        });
    }

    handlerSwitchDatabase(type: boolean) {
        let database;
        if (type) {
            database = this.source.database;
        } else {
            database = this.target.database;
        }
        this.tableService.getAll(this.handlerRequest(type), database).then(response => {
            if (response.status) {
                if (type) {
                    this.source.tables = response.data.columns;
                } else {
                    this.target.tables = response.data.columns;
                }
            } else {
                this.messageService.error(response.message);
            }
        });
    }

    handlerRequest(type: boolean): RequestModel {
        const request = new RequestModel();
        if (type) {
            request.config = this.datasourceService.getAll(this.source.datasource)?.data?.columns[0];
        } else {
            request.config = this.datasourceService.getAll(this.target.datasource)?.data?.columns[0];
        }
        return request;
    }

    handlerMigrate() {
        this.migrateService.migrate(this.source, this.target).then(respnse => { });
    }
}
