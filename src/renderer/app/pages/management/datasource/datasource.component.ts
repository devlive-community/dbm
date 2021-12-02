import { Component, OnInit } from '@angular/core';
import { DatasourceModel } from '@renderer/model/datasource.model';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { RequestModel } from '@renderer/model/request.model';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '@renderer/app/base.component';

@Component({
  selector: 'app-management-datasource',
  templateUrl: 'datasource.component.html'
})
export class DatasourceComponent extends BaseComponent implements OnInit {
  formInfo: DatasourceModel;

  constructor(private service: DatasourceService,
              private toastyService: ToastrService) {
    super();
  }

  ngOnInit() {
    this.formInfo = new DatasourceModel();
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
        this.toastyService.success(response.message);
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
    }
    this.loading.button = false;
  }
}
