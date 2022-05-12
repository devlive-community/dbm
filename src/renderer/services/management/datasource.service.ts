import { BaseService } from '@renderer/services/base.service';
import { ResponseModel } from '@renderer/model/response.model';
import { RequestModel } from '@renderer/model/request.model';
import { DatasourceModel } from '@renderer/model/datasource.model';
import { HttpService } from '@renderer/services/http.service';
import { Injectable } from '@angular/core';
import { PromiseExtended } from 'dexie';
import { PersistenceService } from '@renderer/services/persistence.service';
import { DexieDb } from '@renderer/db/dexiedb';
import { SshService } from '@renderer/services/ssh.service';
import { BasicService } from '@renderer/services/system/basic.service';

@Injectable()
export class DatasourceService extends PersistenceService implements BaseService {
  private db: DexieDb;

  constructor(httpService: HttpService,
              sshService: SshService,
              basicService: BasicService) {
    super(httpService, sshService, basicService);
    this.db = new DexieDb();
  }

  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
    sql = 'SELECT version() AS version';
    return this.forward(request, sql);
  }

  /**
   * Get the local storage buffer data source
   *
   * @param uniqueName Data source name
   */
  getAll(): PromiseExtended<DatasourceModel[]> {
    return this.db.DataSourceTable
    .orderBy('created')
    .reverse()
    .toArray();
  }

  delete(id: number): PromiseExtended {
    return this.db.DataSourceTable.delete(id);
  }

  update(model: DatasourceModel): PromiseExtended {
    model.updated = new Date();
    return this.db.DataSourceTable.update(model.id, model);
  }

  clear(): boolean {
    return false;
  }

  deleteById(id: number): boolean {
    return false;
  }

  save(model: DatasourceModel): PromiseExtended {
    model.created = new Date();
    model.updated = new Date();
    model.id = undefined;
    return this.db.DataSourceTable.add(model);
  }

  findByAlias(alias: string): PromiseExtended<DatasourceModel> {
    return this.db.DataSourceTable.where('alias').equals(alias).first();
  }

  async getByAliasAsync(alias: string): Promise<DatasourceModel> {
    let dataSource;
    dataSource = await this.db.DataSourceTable.where('alias')
    .equals(alias)
    .toArray();
    return dataSource.length > 0 ? dataSource[0] : new DatasourceModel();
  }
}
