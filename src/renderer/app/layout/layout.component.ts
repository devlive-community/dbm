import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BasicService } from '@renderer/services/system/basic.service';
import { SystemBasicModel } from '@renderer/model/system.model';
import { TranslateUtils } from '@renderer/utils/translate.utils';
import { StringUtils } from '@renderer/utils/string.utils';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { RequestUtils } from '@renderer/utils/request.utils';
import { DatasourceModel } from '@renderer/model/datasource.model';
import { NzMessageService } from 'ng-zorro-antd/message';

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
  visible: boolean = false;
  migrateConfirmMessage: string;
  migrateLoading: boolean = false;
  dataSources: DatasourceModel[] = new Array<DatasourceModel>();

  constructor(private translate: TranslateService,
              private basicService: BasicService,
              private messageService: NzMessageService,
              private dataSourceService: DatasourceService) {
    const basicConfig = this.basicService.get() === null ? new SystemBasicModel() : this.basicService.get();
    this.translate.setDefaultLang(basicConfig.language);
    TranslateUtils.init(translate);
    this.initDataSources();
  }

  ngOnInit() {
  }

  initDataSources() {
    this.dataSources = JSON.parse(localStorage.getItem(RequestUtils.KEY_DATASOURCE));
  }

  handlerMigrateShow(value: boolean) {
    this.visible = value;
    if (value) {
      this.migrateConfirmMessage = StringUtils.format(this.translate.instant('formatter.migrate_data'),
        [this.dataSources.length]);
    }
  }

  handlerMigrate() {
    this.migrateLoading = true;
    this.dataSources.forEach(dataSource => {
      this.dataSourceService.save(dataSource).then(() => {
      }).catch(error => {
        this.messageService.error(error);
      });
    });
    this.migrateLoading = false;
    this.visible = false;
    localStorage.removeItem(RequestUtils.KEY_DATASOURCE);
    this.initDataSources();
    this.messageService.success(this.translate.instant('common.success'));
  }
}
