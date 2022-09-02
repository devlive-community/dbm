import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from "@renderer/app/ng-zorro-antd.module";
import { CommonShareModule } from "@renderer/app/common-share.module";
import { DesignerComponent } from "@renderer/app/views/object_designer/designer.component";
import { LayoutContentComponent } from "@renderer/app/views/object_designer/layout/content/layout.content.component";
import { DatabaseService } from "@renderer/services/management/database.service";
import { IconCommonService } from "@renderer/services/common/icon.common.service";
import { TableService } from "@renderer/services/management/table.service";
import {
  LayoutContentDetailDatabaseComponent
} from "@renderer/app/views/object_designer/layout/content/components/preview/database/detail.database.component";
import { AceModule } from "ngx-ace-wrapper";
import {
  CreateTableComponent
} from "@renderer/app/views/object_designer/layout/content/components/create_table/create.table.component";
import {
  PreviewTableComponent
} from "@renderer/app/views/object_designer/layout/content/components/preview_table/preview.table.component";

const DESIGNER_ROUTES: Routes = [
  {path: '', component: DesignerComponent}
];

@NgModule({
  imports: [
    FormsModule,
    TranslateModule,
    CommonModule,
    NgZorroAntdModule,
    CommonShareModule,
    RouterModule.forChild(DESIGNER_ROUTES),
    AceModule
  ],
  exports: [],
  declarations: [
    DesignerComponent,
    LayoutContentComponent,
    LayoutContentDetailDatabaseComponent,
    CreateTableComponent,
    PreviewTableComponent
  ],
  providers: [
    DatabaseService,
    TableService,
    IconCommonService
  ]
})
export class DesignerModule {
}
