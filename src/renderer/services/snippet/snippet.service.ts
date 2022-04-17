import { BaseService } from '@renderer/services/base.service';
import { RequestModel } from '@renderer/model/request.model';
import { ResponseModel } from '@renderer/model/response.model';
import { PersistenceService } from '@renderer/services/persistence.service';
import { DexieDb } from '@renderer/db/dexiedb';
import { SnippetModel } from '@renderer/model/snippet.model';
import { PromiseExtended } from 'dexie';
import { Injectable } from '@angular/core';
import { toNumber } from 'ng-zorro-antd/core/util';

@Injectable()
export class SnippetService extends PersistenceService implements BaseService {
  private db: DexieDb;

  constructor() {
    super();
    this.db = new DexieDb();
  }

  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
    return Promise.resolve(undefined);
  }

  save(model: SnippetModel): PromiseExtended {
    model.created = new Date();
    model.updated = new Date();
    return this.db.SnippetTable.add(model);
  }

  update(model: SnippetModel): PromiseExtended {
    return this.db.SnippetTable.update(model.id, model);
  }

  getAll(): PromiseExtended<SnippetModel[]> {
    return this.db.SnippetTable
    .orderBy('id')
    .reverse()
    .toArray();
  }

  clear(): boolean {
    return false;
  }

  deleteById(id: number): boolean {
    return false;
  }
}
