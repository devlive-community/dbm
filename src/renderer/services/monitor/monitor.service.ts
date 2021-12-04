import { BaseService } from '@renderer/services/base.service';
import { RequestModel } from '@renderer/model/request.model';
import { ResponseModel } from '@renderer/model/response.model';

export class MonitorService implements BaseService {
  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
    return Promise.resolve(undefined);
  }

}
