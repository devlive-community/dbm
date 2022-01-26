import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { NgZorroAntdModule } from '@renderer/app/ng-zorro-antd.module';
import { MetadataComponent } from '@renderer/app/pages/management/metadata/metadata.component';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { ServiceModule } from '@renderer/app/service.module';
import { CommonShareModule } from '@renderer/app/common-share.module';
import { MetadataService } from '@renderer/services/management/metadata.service';
import { ContextMenuService } from '@renderer/services/context.menu.service';
import { InfoServerComponent } from '@renderer/components/server/info/info.server.component';
import { DatabaseBasicComponent } from '@renderer/components/database/basic/database.basic.component';
import { DrividerAntdComponent } from '@renderer/components/antd/drivider/drivider.antd.component';
import { LazyEngineDatabaseComponent } from '@renderer/components/database/engine/lazy/lazy.engine.database.component';
import { PropertyComponent } from '@renderer/components/property/property.component';
import { DatabaseDropComponent } from '@renderer/components/database/drop/database.drop.component';
import { DatabaseStructureComponent } from '@renderer/components/database/structure/database.structure.component';
import { EditorService } from '@renderer/services/editor/editor.service';
import { CommonTableComponent } from '@renderer/components/table/common/common.table.component';
import { CreateTableComponent } from '@renderer/components/table/create/table.create.component';
import { TableService } from '@renderer/services/management/table.service';
import { DeleteTableComponent } from '@renderer/components/table/delete/table.delete.component';
import { StructureTableComponent } from '@renderer/components/table/structure/table.structure.component';
import { RenameTableComponent } from '@renderer/components/table/rename/table.rename.component';
import { TruncateTableComponent } from '@renderer/components/table/truncate/table.truncate.component';
import { CleanTableComponent } from '@renderer/components/table/clean/table.clean.component';
import { OptimizeTableComponent } from '@renderer/components/table/optimize/table.optimize.component';
import { PreviewTableComponent } from '@renderer/components/table/preview/table.preview.component';

const MANAGEMENT_METADATA_ROUTES: Routes = [
  { path: '', component: MetadataComponent }
];

@NgModule({
  imports: [
    FormsModule,
    TranslateModule,
    CommonModule,
    NgZorroAntdModule,
    ServiceModule,
    CommonShareModule,
    CodemirrorModule,
    RouterModule.forChild(MANAGEMENT_METADATA_ROUTES)
  ],
  exports: [],
  declarations: [
    MetadataComponent,
    InfoServerComponent,
    DatabaseBasicComponent,
    DrividerAntdComponent,
    LazyEngineDatabaseComponent,
    PropertyComponent,
    DatabaseDropComponent,
    DatabaseStructureComponent,
    CommonTableComponent,
    CreateTableComponent,
    DeleteTableComponent,
    StructureTableComponent,
    RenameTableComponent,
    TruncateTableComponent,
    CleanTableComponent,
    OptimizeTableComponent,
    PreviewTableComponent
  ],
  providers: [
    DatasourceService,
    MetadataService,
    ContextMenuService,
    EditorService,
    TableService
  ]
})
export class MetadataModule {
}
