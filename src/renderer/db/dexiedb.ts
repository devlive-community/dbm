import Dexie, { Table } from 'dexie';
import { QueryHistoryModel } from '@renderer/model/query.history.model';
import { SnippetModel } from '@renderer/model/snippet.model';

export class DexieDb extends Dexie {
  QueryHistoryTable: Table<QueryHistoryModel, number>;
  SnippetTable: Table<SnippetModel, number>;

  constructor() {
    super('dbm_db');
    this.version(3).stores({
      QueryHistoryTable: '++id,createdTime,startTime,endTime',
      SnippetTable: '++id,name,created,updated'
    });
  }
}
