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
    DatasourceComponent
  ],
  providers: [
    DatasourceService,
    DatasourceJob,
    NzModalService,
    SshService
  ]
})
export class DatasourceModule {
}
