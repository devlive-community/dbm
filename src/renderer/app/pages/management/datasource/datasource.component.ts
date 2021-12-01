import { Component, OnInit } from '@angular/core';
import { DatasourceModel } from '@renderer/model/datasource.model';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { RequestModel } from '@renderer/model/request.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-management-datasource',
  templateUrl: 'datasource.component.html'
})
export class DatasourceComponent implements OnInit {
  formInfo: DatasourceModel;
  loading = {
    test: false
  };

  constructor(private service: DatasourceService,
              private toastyService: ToastrService) {
  }

  ngOnInit() {
    this.formInfo = new DatasourceModel();
  }

  handlerTest() {
    this.loading.test = true;
    const request = new RequestModel();
    request.config = this.formInfo;
    this.service.getResponse(request).then(response => {
      if (!response.status) {
        this.toastyService.error(response.message);
      } else {
        this.toastyService.success(response.message);
      }
      this.loading.test = false;
    });
  }
}
