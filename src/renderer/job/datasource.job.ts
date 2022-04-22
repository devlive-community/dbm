import { DatasourceService } from '@renderer/services/management/datasource.service';
import { RequestModel } from '@renderer/model/request.model';
import { StringUtils } from '@renderer/utils/string.utils';
import { Injectable } from '@angular/core';

@Injectable()
export class DatasourceJob {
  constructor(private datasourceService: DatasourceService) {
  }

  checkHealth() {
    this.datasourceService.getAll().then(response => {
      response.forEach(async element => {
        const request: RequestModel = new RequestModel();
        request.config = element;
        const response = await this.datasourceService.getResponse(request);
        element.status = response.status;
        if (StringUtils.isNotEmpty(response?.data?.columns)) {
          element.version = response.data.columns[0].version;
        } else {
          element.message = response.message;
        }
        this.datasourceService.update(element);
      });
    });
  }
}
