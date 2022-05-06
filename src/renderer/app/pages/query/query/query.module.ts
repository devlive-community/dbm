import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { QueryComponent } from './query.component';
import { TranslateModule } from '@ngx-translate/core';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { EditorService } from '@renderer/services/editor/editor.service';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { CommonModule } from '@angular/common';
import { QueryService } from '@renderer/services/query/query.service';
import { QueryHistoryService } from '@renderer/services/query/query.history.service';
import { NgZorroAntdModule } from '@renderer/app/ng-zorro-antd.module';
import { QuickQueryComponent } from '@renderer/components/query/quick/quick.query.component';
import { QueryQuickService } from '@renderer/services/query/query.quick.service';
import { ServiceModule } from '@renderer/app/service.module';
import { CommonShareModule } from '@renderer/app/common-share.module';
import { QuoteSnippetComponent } from '@renderer/components/snippet/quote/quote.snippet.component';
import { SnippetService } from '@renderer/services/snippet/snippet.service';
import { TableModule } from 'ngx-easy-table';
import { EllipsisModule } from 'ngx-ellipsis';

const QUERY_ROUTES: Routes = [
  {path: '', component: QueryComponent}
];

@NgModule({
  imports: [
    FormsModule,
    TranslateModule,
    CodemirrorModule,
    CommonModule,
    NgZorroAntdModule,
    ServiceModule,
    RouterModule.forChild(QUERY_ROUTES),
    CommonShareModule,
    TableModule,
    EllipsisModule
  ],
  exports: [],
  declarations: [
    QueryComponent,
    QuickQueryComponent,
    QuoteSnippetComponent
  ],
  providers: [
    EditorService,
    DatasourceService,
    QueryService,
    QueryHistoryService,
    QueryQuickService,
    SnippetService
  ]
})
export class QueryModule {
}
