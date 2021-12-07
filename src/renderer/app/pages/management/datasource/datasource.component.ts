import { Component, OnInit, TemplateRef } from '@angular/core';
import { DatasourceModel } from '@renderer/model/datasource.model';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { RequestModel } from '@renderer/model/request.model';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '@renderer/app/base.component';
import { ResponseDataModel } from '@renderer/model/response.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActionEnum } from '@renderer/enum/action.enum';
import { DatasourceJob } from '@renderer/job/datasource.job';

@Component({
  selector: 'app-management-datasource',
  templateUrl: 'datasource.component.html'
})
export class DatasourceComponent extends BaseComponent implements OnInit {
  formInfo: DatasourceModel;
  tableDetails: ResponseDataModel;
  modalRef: BsModalRef;
  actionType: ActionEnum;
  actionSource: string;

  constructor(private service: DatasourceService,
              private toastyService: ToastrService,
              private bsModalService: BsModalService,
              private datasourceJob: DatasourceJob) {
    super();
    this.handlerGetAll();
  }

  ngOnInit() {
    this.formInfo = new DatasourceModel();
  }

  handlerOpenModal(template: TemplateRef<any>, type: ActionEnum, unique?: string) {
    this.bsModalService.config.ignoreBackdropClick = true;
    this.modalRef = this.bsModalService.show(template);
    this.actionType = type;
    this.actionSource = unique;
    switch (type) {
      case ActionEnum.create:
        this.formInfo = new DatasourceModel();
        break;
      case ActionEnum.update:
        this.formInfo = this.service.getAll(unique)?.data?.columns[0];
    }
  }

  handlerCloseModal() {
    this.modalRef.hide();
    this.disabled.button = true;
  }

  handlerTest() {
    this.loading.button = true;
    this.disabled.button = true;
    const request = new RequestModel();
    request.config = this.formInfo;
    this.service.getResponse(request).then(response => {
      if (!response.status) {
        this.toastyService.error(response.message);
      } else {
        this.toastyService.success('Test connection success!');
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
      this.toastyService.error(response.message);
      this.disabled.button = false;
    } else {
      this.toastyService.success(response.message);
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
    this.toastyService.success(response.message);
    this.handlerGetAll();
  }

  handlerUpdate() {
    const response = this.service.update(this.actionSource, this.formInfo);
    if (!response.status) {
      this.toastyService.error(response.message);
    } else {
      this.toastyService.success(response.message);
      this.handlerCloseModal();
      this.handlerGetAll();
    }
  }

  handlerRefresh() {
    this.datasourceJob.checkHealth();
    this.handlerGetAll();
  }
}
