import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonShareModule } from '@renderer/app/common-share.module';
import { MonitorProcessorComponent } from '@renderer/app/pages/monitor/processor/monitor.processor.component';
import { NgZorroAntdModule } from '@renderer/app/ng-zorro-antd.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { MonitorService } from '@renderer/services/monitor/monitor.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EditorService } from '@renderer/services/editor/editor.service';

const MONITOR_PROCESSOR_ROUTES: Routes = [
  {path: '', component: MonitorProcessorComponent}
];

@NgModule({
  imports: [
    CommonShareModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    RouterModule.forChild(MONITOR_PROCESSOR_ROUTES),
    CommonModule
  ],
  exports: [],
  declarations: [
    MonitorProcessorComponent
  ],
  providers: [
    DatasourceService,
    MonitorService,
    NzMessageService,
    EditorService
  ]
})
export class MonitorProcessorModule {
}
