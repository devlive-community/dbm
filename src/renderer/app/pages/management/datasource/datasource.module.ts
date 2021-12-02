import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DatasourceComponent } from './datasource.component';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { InputModule } from '@renderer/directives/bootstrap/input/input.module';
import { CommonModule } from '@angular/common';
import { RadioModule } from '@renderer/directives/bootstrap/radio/radio.module';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

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
    CommonModule,
    RadioModule,
    ToastrModule.forRoot(),
    RouterModule.forChild(DATASOURCE_ROUTES)
  ],
  exports: [],
  declarations: [
    DatasourceComponent
  ],
  providers: [
    {
      provide: ToastrService,
      useClass: ToastrService
    },
    DatasourceService,
    BsModalService
  ]
})
export class DatasourceModule {
}
