import Dexie, { Table } from 'dexie';
import { QueryHistoryModel } from '@renderer/model/query.history.model';

export class DexieDb extends Dexie {
  QueryHistoryTable: Table<QueryHistoryModel, number>;

  constructor() {
    super('dbm_db');
    this.version(1).stores({
      QueryHistoryTable: '++id,createdTime,startTime,endTime'
    });
  }
}
