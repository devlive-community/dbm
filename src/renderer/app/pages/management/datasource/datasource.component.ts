import { Component, OnInit } from '@angular/core';
import { DatasourceModel } from '@renderer/model/datasource.model';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { BaseComponent } from '@renderer/app/base.component';
import { ActionEnum } from '@renderer/enum/action.enum';
import { DatasourceJob } from '@renderer/job/datasource.job';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DatabaseModel } from '@renderer/model/database.model';
import { SourceTypeConfig } from '@renderer/config/source.type.config';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';
import { StringUtils } from '@renderer/utils/string.utils';
import { RequestModel } from '@renderer/model/request.model';
import { DatabaseEnum } from "@renderer/enum/database.enum";
import { FormBuilder, FormGroup } from "@angular/forms";
import { DatasourceDeleteModel } from "@renderer/components/datasource/delete/datasource.delete.model";

@Component({
  selector: 'app-management-datasource',
  templateUrl: 'datasource.component.html',
  styles: [
    `
      .ant-radio-button-wrapper {
        height: auto;
        padding: 0;
      }

      .gutter-row {
        margin-top: 10px;
      }

      .search-box {
        padding: 8px;
      }

      .search-box input {
        width: 188px;
        margin-bottom: 8px;
        display: block;
      }

      .search-box button {
        width: 90px;
      }

      .search-button {
        margin-right: 8px;
      }
    `
  ]
})
export class DatasourceComponent extends BaseComponent implements OnInit {
  formInfo: DatasourceModel;
  tableDetails: DatasourceModel[] = new Array<DatasourceModel>();
  actionType: ActionEnum;
  actionSource: string;
  currentStep: number = 1;
  showButton = {
    previous: false,
    next: false
  };
  sourceTypes: DatabaseModel[];
  dataSourceType = DatabaseEnum;
  validateForm!: FormGroup;
  search = {
    host: {
      visible: false,
      value: null
    }
  }
  applyDeleteValue: DatasourceDeleteModel;

  constructor(private service: DatasourceService,
              private messageService: NzMessageService,
              private translateService: TranslateService,
              private nzModalService: NzModalService,
              private datasourceJob: DatasourceJob,
              private formBuilder: FormBuilder) {
    super();
    this.sourceTypes = new SourceTypeConfig().getConfig();
    this.handlerGetAll();
    this.handlerResetButton();
    this.validateForm = this.formBuilder.group({
      maxTotal: [null, []]
    });
  }

  ngOnInit() {
    this.formInfo = new DatasourceModel();
  }

  handlerChange(value: DatabaseModel) {
    this.formInfo.type = value.type;
    this.handlerResetButton();
  }

  handlerResetButton() {
    if (this.currentStep === 1 && this.formInfo?.type !== undefined) {
      this.showButton.next = true;
    } else {
      this.showButton.previous = true;
    }
  }

  handlerOpenModal(type: ActionEnum, unique?: string) {
    this.dialog.create = true;
    this.actionType = type;
    this.actionSource = unique;
    switch (type) {
      case ActionEnum.create:
        this.formInfo = new DatasourceModel();
        break;
      case ActionEnum.copy:
        this.service.findByAlias(unique).then(response => {
          this.formInfo = response;
          this.formInfo.alias = StringUtils.format('{0} {1}',
            [this.translateService.instant('common.copy'), this.formInfo.alias]);
          this.handlerResetButton();
        });
        break;
      case ActionEnum.update:
        this.service.findByAlias(unique).then(response => {
          this.formInfo = response;
          this.showButton.next = false;
          this.handlerResetButton();
        });
    }
  }

  handlerCloseModal() {
    this.dialog.create = false;
    this.disabled.button = true;
    this.currentStep = 1;
    this.formInfo = new DatasourceModel();
    this.showButton.next = false;
    this.showButton.previous = false;
    this.handlerResetButton();
  }

  handlerTest() {
    this.loading.button = true;
    this.disabled.button = true;
    const request = new RequestModel();
    request.config = this.formInfo;
    this.service.getResponse(request).then(response => {
      if (!response.status) {
        this.messageService.error(response.message);
      } else {
        this.messageService.success('Test connection success!');
        this.formInfo.status = true;
        this.formInfo.version = response?.data?.columns[0]?.version;
        this.disabled.button = false;
      }
      this.loading.button = false;
    });
  }

  handlerSave() {
    this.service.save(this.formInfo)
      .then(() => {
        this.messageService.success(this.translateService.instant('common.success'));
        this.handlerCloseModal();
        this.handlerGetAll();
      })
      .catch(() => {
        this.messageService.error(this.translateService.instant('common.error'));
        this.disabled.button = false;
      });
    this.loading.button = false;
  }

  handlerGetAll() {
    this.service.getAll()
      .then(response => {
        this.tableDetails = response;

      })
      .catch(() => {
        this.messageService.error(this.translateService.instant('common.error'));
      });
  }

  handlerDeleteModal(show: boolean, value: DatasourceModel, emitterValue?: DatasourceDeleteModel) {
    if (emitterValue == null) {
      this.applyDeleteValue = new DatasourceDeleteModel();
      this.applyDeleteValue.visible = show;
      this.applyDeleteValue.value = value;
    } else {
      this.applyDeleteValue = null;
      this.handlerGetAll();
    }
  }

  handlerUpdate() {
    this.service.update(this.formInfo).then(() => {
      this.messageService.success(this.translateService.instant('common.success'));
      this.handlerCloseModal();
      this.handlerGetAll();
    }).catch(error => {
      this.messageService.error(error);
    });
  }

  handlerProcess() {
    switch (this.actionType) {
      case ActionEnum.create:
      case ActionEnum.copy:
        this.handlerSave();
        break;
      case ActionEnum.update:
        this.handlerUpdate();
        break;
    }
  }

  handlerRefresh() {
    this.datasourceJob.checkHealth();
    this.handlerGetAll();
  }

  handlerNext() {
    this.currentStep++;
    this.handlerResetButton();
  }

  handlerPrevious() {
    this.currentStep--;
    this.handlerResetButton();
  }

  handlerShowMessage(title: string, message: string) {
    this.nzModalService.error({
      nzTitle: title,
      nzContent: message,
      nzOkText: this.translateService.instant('common.ok')
    });
  }

  handlerEmitterValue(value: DatasourceModel) {
    this.formInfo = value;
  }

  handlerSearch() {
    this.search.host.visible = false;
    this.tableDetails = this.tableDetails.filter(item => item.host.indexOf(this.search.host.value) !== -1);
  }

  handlerSearchReset() {
    this.search.host.value = '';
    this.handlerGetAll();
  }
}
