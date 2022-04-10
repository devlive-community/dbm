import { BaseService } from '@renderer/services/base.service';
import { RequestModel } from '@renderer/model/request.model';
import { ResponseModel } from '@renderer/model/response.model';
import { PersistenceService } from '@renderer/services/persistence.service';
import { BaseModel } from '@renderer/model/base.model';
import { RequestUtils } from '@renderer/utils/request.utils';
import { SystemBasicModel } from '@renderer/model/system.model';

export class BasicService extends PersistenceService implements BaseService {
  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
    return Promise.resolve(undefined);
  }

  getAll(): BaseModel[] {
    return [];
  }

  save(model: BaseModel): any {
    localStorage.setItem(RequestUtils.KEY_SYSTEM_SETTING_BASIC, JSON.stringify(model));
  }

  get(): SystemBasicModel {
    return JSON.parse(localStorage.getItem(RequestUtils.KEY_SYSTEM_SETTING_BASIC));
  }

  clear(): boolean {
    return false;
  }

  deleteById(id: number): boolean {
    return false;
  }
}
