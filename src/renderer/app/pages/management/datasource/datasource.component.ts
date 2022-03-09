import { Component, OnInit } from '@angular/core';
import { DatasourceModel } from '@renderer/model/datasource.model';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { RequestModel } from '@renderer/model/request.model';
import { BaseComponent } from '@renderer/app/base.component';
import { ResponseDataModel } from '@renderer/model/response.model';
import { ActionEnum } from '@renderer/enum/action.enum';
import { DatasourceJob } from '@renderer/job/datasource.job';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DatabaseModel } from '@renderer/model/database.model';
import { SourceTypeConfig } from '@renderer/config/source.type.config';

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
  tableDetails: ResponseDataModel;
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
              private datasourceJob: DatasourceJob,
              private formBuilder: FormBuilder) {
    super();
    this.validateForm = this.formBuilder.group({
      alias: [null, [Validators.required]],
      protocol: [null, [Validators.required]],
      host: [null, [Validators.required]],
      port: [null, [Validators.required]],
      username: [null, []],
      password: [null, []]
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
      case ActionEnum.update:
        this.formInfo = this.service.getAll(unique)?.data?.columns[0];
        this.showButton.next = false;
        this.handlerResetButton();
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
        this.disabled.button = false;
      }
      this.loading.button = false;
    });
  }

  handlerSave() {
    const request = new RequestModel();
    request.config = this.formInfo;
    const response = this.service.save(request);
    if (!response.status) {
      this.messageService.error(response.message);
      this.disabled.button = false;
    } else {
      this.messageService.success(response.message);
      this.handlerCloseModal();
      this.handlerGetAll();
    }
    this.loading.button = false;
  }

  handlerGetAll() {
    this.tableDetails = this.service.getAll().data;
  }

  handlerDelete(unique: string) {
    const response = this.service.delete(unique);
    this.messageService.success(response.message);
    this.handlerGetAll();
  }

  handlerUpdate() {
    const response = this.service.update(this.actionSource, this.formInfo);
    if (!response.status) {
      this.messageService.error(response.message);
    } else {
      this.messageService.success(response.message);
      this.handlerCloseModal();
      this.handlerGetAll();
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
}
