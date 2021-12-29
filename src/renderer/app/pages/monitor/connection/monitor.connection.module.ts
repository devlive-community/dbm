import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonShareModule } from '@renderer/app/common-share.module';
import { NgZorroAntdModule } from '@renderer/app/ng-zorro-antd.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { MonitorService } from '@renderer/services/monitor/monitor.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MonitorConnectionComponent } from '@renderer/app/pages/monitor/connection/monitor.connection.component';

const MONITOR_CONNECTION_ROUTES: Routes = [
  {path: '', component: MonitorConnectionComponent}
];

@NgModule({
  imports: [
    CommonShareModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    RouterModule.forChild(MONITOR_CONNECTION_ROUTES),
    CommonModule
  ],
  exports: [],
  declarations: [
    MonitorConnectionComponent
  ],
  providers: [
    DatasourceService,
    MonitorService,
    NzMessageService
  ]
})
export class MonitorConnectionModule {
}
