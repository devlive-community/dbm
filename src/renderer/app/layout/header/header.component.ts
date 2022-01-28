import { shell, ipcRenderer } from 'electron';
import { Component, OnInit } from '@angular/core';
import { PackageUtils } from '@renderer/utils/package.utils';
import { BaseComponent } from '@renderer/app/base.component';
import { StringUtils } from '@renderer/utils/string.utils';
import { UpdateEnum } from '@renderer/enum/update.enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
    `
      .logo {
        width: 120px;
        height: 31px;
        background: rgba(255, 255, 255, 0.2);
        margin: 0px 30px 15px 30px;
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
export class HeaderComponent extends BaseComponent implements OnInit {
  version: string = PackageUtils.get('version');
  update = UpdateEnum;
  latestVersionInfo: any;
  updateResponse: any;
  percentage: 0;

  constructor() {
    super();
  }

  ngOnInit() {
  }

  handlerDirectGitHub() {
    shell.openExternal('https://github.com/EdurtIO/dbm');
  }

  handlerUpdate(flag: boolean) {
    this.updateResponse = null;
    if (flag) {
      this.dialog.update = true;
      this.loading.button = true;
      ipcRenderer.send('check-update');
      this.handlerUpdateState();
    } else {
      this.dialog.update = false;
    }
  }

  handlerDownload() {
    ipcRenderer.send('confirm-downloadUpdate');
    this.handlerUpdateState();
  }

  handlerUpdateState() {
    ipcRenderer.on('updater', (event, arg) => {
      console.log('update status ', arg);
      this.loading.button = false;
      switch (arg.state) {
        case UpdateEnum.hasversion:
          if (StringUtils.isNotEmpty(arg)) {
            this.latestVersionInfo = arg.message;
          }
          break;
        case UpdateEnum.downloading:
          console.log(arg)
          // this.percentage = arg.msg.percent.toFixed(1);
          break;
        case UpdateEnum.completed:
          console.log('download success!');
          ipcRenderer.send('confirm-update');
          break;
        case UpdateEnum.noversion:
          console.log('no version', arg)
          break;
        default:
          this.updateResponse = arg;
          break;
      }
    })
  }
}
