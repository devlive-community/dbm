import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DatasourceComponent } from './datasource.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { DatasourceJob } from '@renderer/job/datasource.job';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

const DATASOURCE_ROUTES: Routes = [
  {path: '', component: DatasourceComponent}
];

@NgModule({
  imports: [
    FormsModule,
    TranslateModule,
    CommonModule,
    NzTableModule,
    NzCardModule,
    NzButtonModule,
    NzToolTipModule,
    NzTableModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzRadioModule,
    NzMessageModule,
    NzPopconfirmModule,
    NzEmptyModule,
    RouterModule.forChild(DATASOURCE_ROUTES),
    ReactiveFormsModule
  ],
  exports: [],
  declarations: [
    DatasourceComponent
  ],
  providers: [
    DatasourceService,
    DatasourceJob
  ]
})
export class DatasourceModule {
}
