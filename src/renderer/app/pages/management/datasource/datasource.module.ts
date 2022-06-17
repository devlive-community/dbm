import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DatasourceComponent } from './datasource.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { DatasourceJob } from '@renderer/job/datasource.job';
import { NgZorroAntdModule } from '@renderer/app/ng-zorro-antd.module';
import { ServiceModule } from '@renderer/app/service.module';
import { CommonShareModule } from '@renderer/app/common-share.module';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SshService } from '@renderer/services/ssh.service';
import { PrestoService } from "@renderer/services/presto.service";
import { DatasourceCommonComponent } from "@renderer/components/datasource/common/datasource.common.component";
import {
  DatasourceClickHouseComponent
} from "@renderer/components/datasource/clickhouse/datasource.clickhouse.component";
import {
  DatasourceProtocolSshComponent
} from "@renderer/components/datasource/protocol/ssh/datasource.protocol.ssh.component";
import { DatasourceTrinoComponent } from "@renderer/components/datasource/trino/datasource.trino.component";
import { DatasourceMysqlComponent } from "@renderer/components/datasource/mysql/datasource.mysql.component";
import { MySQLService } from "@renderer/services/plugin/mysql.service";
import { DatasourceDeleteComponent } from "@renderer/components/datasource/delete/datasource.delete.component";

const DATASOURCE_ROUTES: Routes = [
  {path: '', component: DatasourceComponent}
];

@NgModule({
  imports: [
    FormsModule,
    TranslateModule,
    CommonModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ServiceModule,
    CommonShareModule,
    RouterModule.forChild(DATASOURCE_ROUTES)
  ],
  exports: [],
    declarations: [
        DatasourceComponent,
        DatasourceCommonComponent,
        DatasourceClickHouseComponent,
        DatasourceProtocolSshComponent,
        DatasourceTrinoComponent,
        DatasourceMysqlComponent,
        DatasourceDeleteComponent
    ],
  providers: [
    DatasourceService,
    DatasourceJob,
    NzModalService,
    SshService,
    PrestoService,
    MySQLService
  ]
})
export class DatasourceModule {
}
