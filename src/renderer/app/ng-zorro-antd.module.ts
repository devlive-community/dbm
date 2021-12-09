import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@NgModule({
  exports: [
    NzSelectModule,
    NzButtonModule,
    NzToolTipModule,
    NzFormModule,
    NzCardModule,
    NzModalModule,
    NzPopconfirmModule,
    NzTableModule,
    NzEmptyModule,
    NzBreadCrumbModule,
    NzLayoutModule,
    NzMenuModule,
    NzMessageModule,
    NzInputModule,
    NzRadioModule,
    NzTabsModule
  ]
})
export class NgZorroAntdModule {
}
