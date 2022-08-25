import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from "@renderer/app/ng-zorro-antd.module";
import { CommonShareModule } from "@renderer/app/common-share.module";
import { DesignerComponent } from "@renderer/app/views/object_designer/designer.component";
import { LayoutHeaderComponent } from "@renderer/app/views/object_designer/layout/header/layout.header.component";
import { LayoutContentComponent } from "@renderer/app/views/object_designer/layout/content/layout.content.component";
import { DatabaseService } from "@renderer/services/management/database.service";
import { IconCommonService } from "@renderer/services/common/icon.common.service";
import { TableService } from "@renderer/services/management/table.service";
import {
  LayoutHeaderDatabaseComponent
} from "@renderer/app/views/object_designer/layout/header/database/header.database.component";
import {
  LayoutContentDetailDatabaseComponent
} from "@renderer/app/views/object_designer/layout/content/detail/database/detail.database.component";
import {
  LayoutDetailTableComponent
} from "@renderer/app/views/object_designer/layout/content/detail/table/detail.table.component";
import {
  LayoutContentOperatorTableCreateComponent
} from "@renderer/app/views/object_designer/layout/content/operator/table/create/operator.table.create.component";
import {
  LayoutHeaderOperatorTableCreateComponent
} from "@renderer/app/views/object_designer/layout/header/operator/table/create/operator.table.create.component";
import { TableModule } from "ngx-easy-table";

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
    TableModule,
    RouterModule.forChild(DESIGNER_ROUTES)
  ],
  exports: [],
  declarations: [
    DesignerComponent,
    LayoutHeaderComponent,
    LayoutContentComponent,
    LayoutHeaderDatabaseComponent,
    LayoutContentDetailDatabaseComponent,
    LayoutDetailTableComponent,
    LayoutContentOperatorTableCreateComponent,
    LayoutHeaderOperatorTableCreateComponent
  ],
  providers: [
    DatabaseService,
    TableService,
    IconCommonService
  ]
})
export class DesignerModule {
}
