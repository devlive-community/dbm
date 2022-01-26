import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { ChartModule } from 'angular-highcharts';
import { CommonModule } from '@angular/common';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { ServiceModule } from '@renderer/app/service.module';
import { NgZorroAntdModule } from '@renderer/app/ng-zorro-antd.module';
import { QueryService } from '@renderer/services/query/query.service';
import { ClickhousePluginService } from '@renderer/services/plugin/clickhouse.plugin.service';
import { CommonShareModule } from '@renderer/app/common-share.module';

const HOME_ROUTES: Routes = [
  {path: '', component: HomeComponent}
];

@NgModule({
  imports: [
    FormsModule,
    ChartModule,
    CommonModule,
    ServiceModule,
    NgZorroAntdModule,
    CommonShareModule,
    RouterModule.forChild(HOME_ROUTES)
  ],
  exports: [
  ],
  declarations: [
    HomeComponent
  ],
  providers: [
    DatasourceService,
    QueryService,
    ClickhousePluginService
  ]
})
export class HomeModule {
}
