import { BaseService } from '@renderer/services/base.service';
import { RequestModel } from '@renderer/model/request.model';
import { ResponseModel } from '@renderer/model/response.model';
import { PersistenceService } from '@renderer/services/persistence.service';
import { DexieDb } from '@renderer/db/dexiedb';
import { QueryHistoryModel } from '@renderer/model/query.history.model';

export class QueryHistoryService extends PersistenceService implements BaseService {
  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
    return Promise.resolve(undefined);
  }

  save(model: QueryHistoryModel): any {
    const db = new DexieDb();
    db.QueryHistoryTable.add(model);
  }

  getAll(): QueryHistoryModel[] {
    const db = new DexieDb();
    const queryHistories = new Array();
    db.QueryHistoryTable
    .orderBy('createdTime')
    .reverse()
    .toArray()
    .then(result => result.forEach(item => queryHistories.push(item)));
    return queryHistories;
  }

  clear(): boolean {
    const db = new DexieDb();
    try {
      db.QueryHistoryTable.clear();
      return true;
    } catch (error) {
      return false;
    }
  }

  deleteById(id: number): boolean {
    const db = new DexieDb();
    try {
      db.QueryHistoryTable.delete(id);
      return true;
    } catch (error) {
      return false;
    }
  }
}
