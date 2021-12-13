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

const TOOLS_TRACK_ROUTES: Routes = [
  {path: '', component: TrackComponent}
];

@NgModule({
  imports: [
    FormsModule,
    TranslateModule,
    CommonModule,
    NgZorroAntdModule,
    RouterModule.forChild(TOOLS_TRACK_ROUTES)
  ],
  exports: [],
  declarations: [
    TrackComponent
  ],
  providers: [
    DatasourceService,
    TrackService,
    NzModalService
  ]
})
export class TrackModule {
}
