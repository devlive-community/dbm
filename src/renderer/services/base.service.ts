import { ResponseModel } from '@renderer/model/response.model';
import { RequestModel } from '@renderer/model/request.model';

export interface BaseService {
  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel>;
}
