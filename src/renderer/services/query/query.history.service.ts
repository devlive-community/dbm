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
    let historySet = JSON.parse(localStorage.getItem(Support.QUERY_HISTORY));
    historySet = historySet === null ? [] : historySet;
    let index = 1;
    if (historySet.length > 0) {
      index = historySet.length + 1;
    }
    if (index <= 100) {
      historySet.id = index;
      historySet.unshift(model);
      localStorage.setItem(Support.QUERY_HISTORY, JSON.stringify(historySet));
    }
  }

  getAll(): BaseModel[] {
    return JSON.parse(localStorage.getItem(Support.QUERY_HISTORY));
  }

  clear() {
    localStorage.removeItem(Support.QUERY_HISTORY);
  }
}
