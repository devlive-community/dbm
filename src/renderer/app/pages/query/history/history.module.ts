import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HistoryComponent } from './history.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { QueryHistoryService } from '@renderer/services/query/query.history.service';
import { NgZorroAntdModule } from '@renderer/app/ng-zorro-antd.module';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CommonShareModule } from '@renderer/app/common-share.module';
import { EditorService } from '@renderer/services/editor/editor.service';
import { MomentModule } from 'ngx-moment';

const QUERY_ROUTES: Routes = [
  {path: '', component: HistoryComponent}
];

@NgModule({
  imports: [
    FormsModule,
    TranslateModule,
    CommonModule,
    NgZorroAntdModule,
    RouterModule.forChild(QUERY_ROUTES),
    CodemirrorModule,
    CommonShareModule,
    MomentModule
  ],
  exports: [],
  declarations: [
    HistoryComponent
  ],
  providers: [
    TranslateService,
    QueryHistoryService,
    NzModalService,
    EditorService
  ]
})
export class HistoryModule {
}
