import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DefaultDesignerComponent } from "@renderer/app/views/object_designer/default/default.designer.component";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { NgZorroAntdModule } from "@renderer/app/ng-zorro-antd.module";
import { CommonShareModule } from "@renderer/app/common-share.module";

const DESIGNER_ROUTES: Routes = [
  {path: '', component: DefaultDesignerComponent}
];

@NgModule({
  imports: [
    FormsModule,
    TranslateModule,
    CommonModule,
    NgZorroAntdModule,
    CommonShareModule,
    RouterModule.forChild(DESIGNER_ROUTES)
  ],
  exports: [],
  declarations: [
    DefaultDesignerComponent
  ]
})
export class DefaultDesignerModule {
}
