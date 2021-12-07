import { BaseService } from '@renderer/services/base.service';
import { RequestModel } from '@renderer/model/request.model';
import { ResponseModel } from '@renderer/model/response.model';

export interface BasePluginService extends BaseService {
  getQueryCount(request: RequestModel): Promise<ResponseModel>;
}
