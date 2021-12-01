import { BaseService } from '@renderer/services/base.service';
import { ResponseModel } from '@renderer/model/response.model';
import { RequestModel } from '@renderer/model/request.model';
import { HttpUtils } from '@renderer/utils/http.utils';
import { UrlUtils } from '@renderer/utils/url.utils';

export class DatasourceService implements BaseService {
  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
    sql = 'SELECT version() AS version';
    return HttpUtils.post(UrlUtils.formatUrl(request), sql);
  }
}
