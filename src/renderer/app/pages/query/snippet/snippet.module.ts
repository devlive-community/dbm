import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { QueryHistoryService } from '@renderer/services/query/query.history.service';
import { NgZorroAntdModule } from '@renderer/app/ng-zorro-antd.module';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CommonShareModule } from '@renderer/app/common-share.module';
import { EditorService } from '@renderer/services/editor/editor.service';
import { SnippetComponent } from '@renderer/app/pages/query/snippet/snippet.component';
import { TableModule } from 'ngx-easy-table';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { SnippetService } from '@renderer/services/snippet/snippet.service';
import { MomentModule } from 'ngx-moment';

const QUERY_ROUTES: Routes = [
  {path: '', component: SnippetComponent}
];

@NgModule({
  imports: [
    FormsModule,
    TranslateModule,
    CommonModule,
    NgZorroAntdModule,
    RouterModule.forChild(QUERY_ROUTES),
    CommonShareModule,
    TableModule,
    CodemirrorModule,
    ReactiveFormsModule,
    MomentModule
  ],
  exports: [],
  declarations: [
    SnippetComponent
  ],
  providers: [
    TranslateService,
    QueryHistoryService,
    NzModalService,
    EditorService,
    SnippetService
  ]
})
export class SnippetModule {
}
