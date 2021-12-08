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

const QUERY_ROUTES: Routes = [
  {path: '', component: QueryComponent}
];

@NgModule({
  imports: [
    FormsModule,
    TranslateModule,
    CodemirrorModule,
    RouterModule.forChild(QUERY_ROUTES),
    CommonModule
  ],
  exports: [],
  declarations: [
    QueryComponent
  ],
  providers: [
    EditorService,
    DatasourceService,
    QueryService,
    QueryHistoryService
  ]
})
export class QueryModule {
}
