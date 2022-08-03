export enum DatabaseEnum {
  none = 'Default',
  atomic = 'Atomic',
  lazy = 'Lazy',
  mysql = 'MySQL',
  materialized_mysql = 'MaterializedMySQL',
  materialized_postgresql = 'MaterializedPostgreSQL',

  // Table Engine
  log = 'Log',
  tinylog = 'TinyLog',
  stripelog = 'StripeLog',
  kafka = 'Kafka',
  hdfs = 'HDFS',
  jdbc = 'JDBC',
  sqlite = 'SQLite',
  odbc = 'ODBC',
  mongodb = 'MongoDB',
  hive = 'Hive',

  // DataSource Type
  clickhosue = 'ClickHouse',
  trino = 'Trino',
  presto = 'Presto',
  postgresql = 'PostgreSQL',
  druid = 'Druid',
  elasticsearch = 'ElasticSearch'
}
