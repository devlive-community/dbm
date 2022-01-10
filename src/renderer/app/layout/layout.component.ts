import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BasicService } from '@renderer/services/system/basic.service';
import { SystemBasicModel } from '@renderer/model/system.model';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styles: [
    `
      nz-breadcrumb {
        margin: 16px 0;
      }

      .ant-layout-header {
        padding: 0;
      }

      nz-content {
        padding: 0 10px;
      }

      nz-footer {
        text-align: center;
      }

      .inner-content {
        padding: 24px;
        min-height: 280px;
      }

      .ant-layout {
        background-color: #ffffff;
      }
    `
  ]
})
export class LayoutComponent implements OnInit {
  constructor(private translate: TranslateService,
              private basicService: BasicService) {
    const basicConfig = this.basicService.get() === null ? new SystemBasicModel() : this.basicService.get();
    this.translate.setDefaultLang(basicConfig.language);
  }

  ngOnInit() {
  }
}
