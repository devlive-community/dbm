import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from '@renderer/app/ng-zorro-antd.module';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { TrackService } from '@renderer/services/tools/track.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { ClipboardComService } from '@renderer/services/other/clipboard.service';
import { ServiceModule } from '@renderer/app/service.module';
import { CommonShareModule } from '@renderer/app/common-share.module';
import { EditorService } from '@renderer/services/editor/editor.service';
import { MigrteComponent } from './migrte.component';
import { DatabaseService } from '@renderer/services/management/database.service';
import { TableService } from '@renderer/services/management/table.service';
import { MigrateService } from '@renderer/services/tools/migrate.service';

const TOOLS_MIGRTE_ROUTES: Routes = [
    { path: '', component: MigrteComponent }
];

@NgModule({
    imports: [
        FormsModule,
        TranslateModule,
        CommonModule,
        NgZorroAntdModule,
        CodemirrorModule,
        ServiceModule,
        CommonShareModule,
        RouterModule.forChild(TOOLS_MIGRTE_ROUTES)
    ],
    exports: [],
    declarations: [
        MigrteComponent
    ],
    providers: [
        DatasourceService,
        TrackService,
        NzModalService,
        ClipboardComService,
        EditorService,
        DatabaseService,
        TableService,
        MigrateService
    ]
})
export class MigrateModule {
}
