import Dexie, { Table } from 'dexie';
import { QueryHistoryModel } from '@renderer/model/query.history.model';
import { SnippetModel } from '@renderer/model/snippet.model';
import { DatasourceModel } from '@renderer/model/datasource.model';

export class DexieDb extends Dexie {
  QueryHistoryTable: Table<QueryHistoryModel, number>;
  SnippetTable: Table<SnippetModel, number>;
  DataSourceTable: Table<DatasourceModel, number>;

  constructor() {
    super('dbm_db');
    this.version(4)
    .stores({
      QueryHistoryTable: '++id,createdTime,startTime,endTime',
      SnippetTable: '++id,name,created,updated',
      DataSourceTable: '++id,name,alias,host,status,created,updated'
    });
  }
}
