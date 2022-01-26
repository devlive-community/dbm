import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from '@renderer/app/ng-zorro-antd.module';
import { SystemEditorComponent } from '@renderer/app/pages/system/editor/system.editor.component';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { EditorService } from '@renderer/services/editor/editor.service';
import { DomChangedDirective } from '@renderer/directives/dom/dom.changed.directive';

const SYSTEM_EDITOR_ROUTES: Routes = [
  {path: '', component: SystemEditorComponent}
];

@NgModule({
  imports: [
    FormsModule,
    TranslateModule,
    CommonModule,
    NgZorroAntdModule,
    CodemirrorModule,
    RouterModule.forChild(SYSTEM_EDITOR_ROUTES)
  ],
  exports: [],
  declarations: [
    SystemEditorComponent,
    DomChangedDirective
  ],
  providers: [
    EditorService
  ]
})
export class SystemEditorModule {
}
