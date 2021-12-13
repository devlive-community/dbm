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
    RouterModule.forChild(QUERY_ROUTES)
  ],
  exports: [],
  declarations: [
    QueryComponent,
    QuickQueryComponent
  ],
  providers: [
    EditorService,
    DatasourceService,
    QueryService,
    QueryHistoryService,
    QueryQuickService
  ]
})
export class QueryModule {
}
