import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { QueryBetaComponent } from './query.beta.component';
import { TranslateModule } from '@ngx-translate/core';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { CommonModule } from '@angular/common';
import { QueryService } from '@renderer/services/query/query.service';
import { NgZorroAntdModule } from '@renderer/app/ng-zorro-antd.module';
import { CommonShareModule } from '@renderer/app/common-share.module';
import { DatabaseService } from "@renderer/services/management/database.service";
import { TableService } from "@renderer/services/management/table.service";
import { ColumnService } from "@renderer/services/management/column.service";
import { IconCommonService } from "@renderer/services/common/icon.common.service";
import { MenuCommonService } from "@renderer/services/common/menu.common.service";
import { CodemirrorModule } from "@ctrl/ngx-codemirror";
import { EditorService } from "@renderer/services/editor/editor.service";
import { AceModule } from "ngx-ace-wrapper";
import { TableModule } from "ngx-easy-table";
import { EllipsisModule } from "ngx-ellipsis";

const QUERY_ROUTES: Routes = [
  {path: '', component: QueryBetaComponent}
];

@NgModule({
  imports: [
    FormsModule,
    TranslateModule,
    CommonModule,
    NgZorroAntdModule,
    CommonShareModule,
    CodemirrorModule,
    AceModule,
    RouterModule.forChild(QUERY_ROUTES),
    TableModule,
    EllipsisModule
  ],
  exports: [],
  declarations: [
    QueryBetaComponent
  ],
  providers: [
    DatasourceService,
    QueryService,
    DatabaseService,
    TableService,
    ColumnService,
    IconCommonService,
    MenuCommonService,
    EditorService,
    QueryService
  ]
})
export class QueryBetaModule {
}
