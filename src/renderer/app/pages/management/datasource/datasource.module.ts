import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DatasourceComponent } from './datasource.component';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { InputModule } from '@renderer/directives/bootstrap/input/input.module';
import { CommonModule } from '@angular/common';
import { RadioModule } from '@renderer/directives/bootstrap/radio/radio.module';

const DATASOURCE_ROUTES: Routes = [
  {path: '', component: DatasourceComponent}
];

@NgModule({
  imports: [
    FormsModule,
    TranslateModule,
    TooltipModule,
    ModalModule,
    InputModule,
    RouterModule.forChild(DATASOURCE_ROUTES),
    CommonModule,
    RadioModule
  ],
  exports: [],
  declarations: [
    DatasourceComponent
  ],
  providers: []
})
export class DatasourceModule {
}
