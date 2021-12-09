export class QueryQuickService {
  getQuickAll() {
    return [{
      name: 'DESCRIBE ...',
      value: 'DESCRIBE {0}'
    }, {
      name: 'SHOW CREATE TABLE ...',
      value: 'SHOW CREATE TABLE {0}'
    }, {
      name: 'SELECT ... LIMIT 100',
      value: 'SELECT * FROM {0} LIMIT 100'
    }, {
      name: 'SELECT COUNT FROM ...',
      value: 'SELECT COUNT(1) FROM {0}'
    }];
  }
}
