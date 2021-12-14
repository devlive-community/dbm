import { NgModule } from '@angular/core';
import { DdlQueryComponent } from '@renderer/components/query/ddl/ddl.query.component';
import { NgZorroAntdModule } from '@renderer/app/ng-zorro-antd.module';
import { TranslateModule } from '@ngx-translate/core';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { FormsModule } from '@angular/forms';
import { ClipboardComService } from '@renderer/services/other/clipboard.service';
import { BasicTableComponent } from '@renderer/components/table/basic/basic.table.component';
import { CommonModule } from '@angular/common';
import { ServiceModule } from '@renderer/app/service.module';

@NgModule({
  imports: [
    NgZorroAntdModule,
    TranslateModule,
    CodemirrorModule,
    FormsModule,
    CommonModule,
    ServiceModule
  ],
  declarations: [
    DdlQueryComponent,
    BasicTableComponent
  ],
  providers: [
    ClipboardComService
  ],
  exports: [
    DdlQueryComponent,
    BasicTableComponent
  ]
})
export class CommonShareModule {
}
