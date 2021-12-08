import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styles: [
    `
      nz-breadcrumb {
        margin: 16px 0;
      }

      .ant-layout-header{
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
    `
  ]
})
export class LayoutComponent implements OnInit {
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit() {
  }
}
