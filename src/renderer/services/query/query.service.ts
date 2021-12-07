import { BaseService } from '@renderer/services/base.service';
import { RequestModel } from '@renderer/model/request.model';
import { ResponseModel } from '@renderer/model/response.model';
import { HttpUtils } from '@renderer/utils/http.utils';
import { UrlUtils } from '@renderer/utils/url.utils';

export class QueryService implements BaseService {
  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
    return HttpUtils.post(UrlUtils.formatUrl(request), sql);
  }
}
