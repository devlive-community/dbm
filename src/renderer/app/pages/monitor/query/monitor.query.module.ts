import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonShareModule } from '@renderer/app/common-share.module';
import { NgZorroAntdModule } from '@renderer/app/ng-zorro-antd.module';
import { EditorService } from '@renderer/services/editor/editor.service';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { MonitorService } from '@renderer/services/monitor/monitor.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MonitorQueryComponent } from './monitor.query.component';

const MONITOR_QUERY_ROUTES: Routes = [
  { path: '', component: MonitorQueryComponent }
];

@NgModule({
  imports: [
    CommonShareModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    RouterModule.forChild(MONITOR_QUERY_ROUTES),
    CommonModule
  ],
  exports: [],
  declarations: [
    MonitorQueryComponent
  ],
  providers: [
    DatasourceService,
    MonitorService,
    NzMessageService,
    EditorService
  ]
})
export class MonitorQueryModule {
}
