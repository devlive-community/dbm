import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { QueryComponent } from './query.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { EditorService } from '@renderer/services/editor/editor.service';
import { NgxSelectModule } from 'ngx-select-ex';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { CommonModule } from '@angular/common';
import { QueryService } from '@renderer/services/query/query.service';
import { TableModule } from '@renderer/directives/bootstrap/table/table.module';

const QUERY_ROUTES: Routes = [
  {path: '', component: QueryComponent}
];

@NgModule({
  imports: [
    FormsModule,
    TooltipModule,
    TranslateModule,
    CodemirrorModule,
    RouterModule.forChild(QUERY_ROUTES),
    NgxSelectModule,
    CommonModule,
    TableModule
  ],
  exports: [],
  declarations: [
    QueryComponent
  ],
  providers: [
    EditorService,
    DatasourceService,
    QueryService
  ]
})
export class QueryModule {
}
