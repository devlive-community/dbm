import { Component, OnInit } from '@angular/core';
import { DatasourceModel } from '@renderer/model/datasource.model';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { BaseComponent } from '@renderer/app/base.component';
import { ActionEnum } from '@renderer/enum/action.enum';
import { DatasourceJob } from '@renderer/job/datasource.job';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DatabaseModel } from '@renderer/model/database.model';
import { SourceTypeConfig } from '@renderer/config/source.type.config';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';
import { StringUtils } from '@renderer/utils/string.utils';
import { RequestModel } from '@renderer/model/request.model';

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
    `
  ]
})
export class DatasourceComponent extends BaseComponent implements OnInit {
  formInfo: DatasourceModel;
  tableDetails: DatasourceModel[] = new Array<DatasourceModel>();
  actionType: ActionEnum;
  actionSource: string;
  validateForm!: FormGroup;
  currentStep: number = 1;
  showButton = {
    previous: false,
    next: false
  };
  sourceTypes: DatabaseModel[];

  constructor(private service: DatasourceService,
              private messageService: NzMessageService,
              private translateService: TranslateService,
              private nzModalService: NzModalService,
              private datasourceJob: DatasourceJob,
              private formBuilder: FormBuilder) {
    super();
    this.validateForm = this.formBuilder.group({
      alias: [null, [Validators.required]],
      protocol: [null, [Validators.required]],
      host: [null, [Validators.required]],
      port: [null, [Validators.required]],
      username: [null, []],
      password: [null, []],
      maxTotal: [null, []],
      sshHost: [null, []],
      sshPort: [null, []],
      sshUsername: [null, []],
      sshPassword: [null, []]
    });
    this.sourceTypes = new SourceTypeConfig().getConfig();
    this.handlerGetAll();
    this.handlerResetButton();
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
    this.validateForm.clearValidators();
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

  handlerDelete(id: number) {
    this.service.delete(id).then(() => {
      this.messageService.success(this.translateService.instant('common.success'));
      this.handlerGetAll();
    }).catch(error => {
      this.messageService.error(error);
    });
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

  handlerSubmitForm(): void {
    if (this.validateForm.valid) {
      this.handlerTest();
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
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
}
