import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CodemirrorModule } from "@ctrl/ngx-codemirror";
import { TranslateModule } from '@ngx-translate/core';
import { CommonShareModule } from '@renderer/app/common-share.module';
import { NgZorroAntdModule } from '@renderer/app/ng-zorro-antd.module';
import { PluginFactory } from '@renderer/factory/plugin.factory';
import { ClickHousePlugin } from '@renderer/plugin/clickhouse.plugin';
import { IconCommonService } from "@renderer/services/common/icon.common.service";
import { MenuCommonService } from "@renderer/services/common/menu.common.service";
import { EditorService } from "@renderer/services/editor/editor.service";
import { ColumnService } from "@renderer/services/management/column.service";
import { DatabaseService } from "@renderer/services/management/database.service";
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { TableService } from "@renderer/services/management/table.service";
import { QueryService } from '@renderer/services/query/query.service';
import { PluginToken } from '@renderer/token/plugin.token';
import { AceModule } from "ngx-ace-wrapper";
import { TableModule } from "ngx-easy-table";
import { EllipsisModule } from "ngx-ellipsis";
import { QueryBetaComponent } from './query.beta.component';

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
    QueryService,
    PluginFactory,
    { provide: PluginToken, useClass: ClickHousePlugin, multi: true }
  ]
})
export class QueryBetaModule {
}
