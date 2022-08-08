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
import {
    DatasourcePostgresqlComponent
} from "@renderer/components/datasource/postgresql/datasource.postgresql.component";
import { DatasourceDruidComponent } from "@renderer/components/datasource/druid/datasource.druid.component";
import {
    DatasourceElasticSearchComponent
} from "@renderer/components/datasource/elasticsearch/datasource.elasticsearch.component";
import { DatasourceHologresComponent } from "@renderer/components/datasource/hologres/datasource.hologres.component";

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
        DatasourceDeleteComponent,
        DatasourcePostgresqlComponent,
        DatasourceDruidComponent,
        DatasourceElasticSearchComponent,
        DatasourceHologresComponent
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
