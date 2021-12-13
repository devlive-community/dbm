import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from '@renderer/app/ng-zorro-antd.module';
import { BasicComponent } from '@renderer/app/pages/system/basic/basic.component';
import { BasicService } from '@renderer/services/system/basic.service';

const SYSTEM_BASIC_ROUTES: Routes = [
  {path: '', component: BasicComponent}
];

@NgModule({
  imports: [
    FormsModule,
    TranslateModule,
    CommonModule,
    NgZorroAntdModule,
    RouterModule.forChild(SYSTEM_BASIC_ROUTES)
  ],
  exports: [],
  declarations: [
    BasicComponent
  ],
  providers: [
    BasicService
  ]
})
export class BasicModule {
}
