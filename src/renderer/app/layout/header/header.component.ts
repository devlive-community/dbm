import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
    `
      .logo {
        width: 120px;
        height: 31px;
        background: rgba(255, 255, 255, 0.2);
        margin: 3px 30px 15px 30px;
        float: left;
      }

      nz-header {
        position: fixed;
        width: 100%;
      }

      .ant-layout-header {
        padding: 0;
      }
    `
  ]
})
export class HeaderComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
