import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from '@renderer/app/ng-zorro-antd.module';
import { TrackComponent } from '@renderer/app/pages/tools/track/track.component';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { TrackService } from '@renderer/services/tools/track.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DdlQueryComponent } from '@renderer/components/query/ddl/ddl.query.component';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { ClipboardComService } from '@renderer/services/other/clipboard.service';
import { ServiceModule } from '@renderer/app/service.module';

const TOOLS_TRACK_ROUTES: Routes = [
  {path: '', component: TrackComponent}
];

@NgModule({
  imports: [
    FormsModule,
    TranslateModule,
    CommonModule,
    NgZorroAntdModule,
    CodemirrorModule,
    ServiceModule,
    RouterModule.forChild(TOOLS_TRACK_ROUTES)
  ],
  exports: [],
  declarations: [
    TrackComponent,
    DdlQueryComponent
  ],
  providers: [
    DatasourceService,
    TrackService,
    NzModalService,
    ClipboardComService
  ]
})
export class TrackModule {
}
