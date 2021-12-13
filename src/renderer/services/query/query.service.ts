import { BaseService } from '@renderer/services/base.service';
import { RequestModel } from '@renderer/model/request.model';
import { ResponseModel } from '@renderer/model/response.model';
import { HttpService } from '@renderer/services/http.service';
import { UrlUtils } from '@renderer/utils/url.utils';
import { Injectable } from '@angular/core';

@Injectable()
export class QueryService implements BaseService {
  constructor(private httpService: HttpService) {
  }

  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
    return this.httpService.post(UrlUtils.formatUrl(request), sql);
  }
}
