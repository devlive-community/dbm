export enum DatabaseEnum {
  none = 'Default',
  atomic = 'Atomic',
  lazy = 'Lazy',
  mysql = 'MySQL',
  materialized_mysql = 'MaterializedMySQL',

  // Table Engine
  log = 'Log',
  tinylog = 'TinyLog',
  stripelog = 'StripeLog',
  kafka = 'Kafka',
  hdfs = 'HDFS',
  jdbc = 'JDBC',
  sqlite = 'SQLite',
  odbc = 'ODBC',

  // DataSource Type
  clickhosue = 'ClickHouse'
}
