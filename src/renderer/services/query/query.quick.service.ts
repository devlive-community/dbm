export class QueryQuickService {
  getQuickAll() {
    return [{
      name: 'DESCRIBE ...',
      value: 'DESCRIBE `{0}`.`{1}`'
    }, {
      name: 'SHOW CREATE TABLE ...',
      value: 'SHOW CREATE TABLE `{0}`.`{1}`'
    }, {
      name: 'SELECT ... LIMIT 100',
      value: 'SELECT * FROM `{0}`.`{1}` LIMIT 100'
    }, {
      name: 'SELECT COUNT FROM ...',
      value: 'SELECT COUNT(1) FROM `{0}`.`{1}`'
    }, {
      name: 'SHOW PARTITIONS FROM ...',
      value: 'SELECT `partition` FROM `system`.parts WHERE `database` = \'{0}\' AND `table` = \'{1}\''
    }];
  }
}
