import { BaseService } from '@renderer/services/base.service';
import { RequestModel } from '@renderer/model/request.model';
import { ResponseModel } from '@renderer/model/response.model';
import { PersistenceService } from '@renderer/services/persistence.service';
import { BaseModel } from '@renderer/model/base.model';
import { Support } from '@renderer/support';

export class QueryHistoryService extends PersistenceService implements BaseService {
  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
    return Promise.resolve(undefined);
  }

  save(model: BaseModel): any {
    let histroys = JSON.parse(localStorage.getItem(Support.QUERY_HISTORY));
    histroys = histroys === null ? [] : histroys;
    let index = 1;
    if (histroys.length > 0) {
      index = histroys.length + 1;
    }
    if (index <= 100) {
      histroys.id = index;
      histroys.unshift(model);
      localStorage.setItem(Support.QUERY_HISTORY, JSON.stringify(histroys));
    }
  }

  getAll(): BaseModel[] {
    return JSON.parse(localStorage.getItem(Support.QUERY_HISTORY));
  }
}
