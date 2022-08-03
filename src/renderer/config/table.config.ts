import { Injectable } from '@angular/core';
import { DatabaseEnum } from '@renderer/enum/database.enum';
import { DatabaseModel } from '@renderer/model/database.model';
import { StringUtils } from '@renderer/utils/string.utils';
import { TranslateUtils } from '@renderer/utils/translate.utils';
import { PropertyModel } from '@renderer/model/property.model';
import { PropertyEnum } from '@renderer/enum/property.enum';
import { HiveTableEngine } from "@renderer/config/engine/table/engine.table.hive.config";

@Injectable()
export class TableConfig {
  getConfig(): DatabaseModel[] {
    const tableEngines = new Array();
    /**
     * Default Engine
     */
    const defaultTable = new DatabaseModel();
    defaultTable.name = TranslateUtils.getValue('common.default');
    defaultTable.description = TranslateUtils.getValue('tooltip.table.default');
    defaultTable.supportedSource = [DatabaseEnum.mysql, DatabaseEnum.postgresql];
    const defaultEngines = new Array();
    const i_default = DatabaseModel.builder(TranslateUtils.getValue('common.default'),
      TranslateUtils.getValue('tooltip.table.default'),
      DatabaseEnum.none,
      null)
    i_default.supportedSource = [DatabaseEnum.mysql, DatabaseEnum.postgresql];
    defaultEngines.push(i_default);
    defaultTable.engines = defaultEngines;
    tableEngines.push(defaultTable);

    /**
     * Log Engine
     */
    const logTable = new DatabaseModel();
    logTable.name = StringUtils.format('{0}',
      [TranslateUtils.getValue('common.log')]);
    logTable.description = TranslateUtils.getValue('tooltip.table.log');
    logTable.supportedSource = [DatabaseEnum.clickhosue];
    const logEngines = new Array();

    // Log
    const log = DatabaseModel.builder(TranslateUtils.getValue('common.log'),
      TranslateUtils.getValue('tooltip.table.log'),
      DatabaseEnum.log,
      null)
    log.supportedSource = [DatabaseEnum.clickhosue];
    logEngines.push(log);

    // TinyLog
    const tinylog = DatabaseModel.builder(TranslateUtils.getValue('common.tinylog'),
      TranslateUtils.getValue('tooltip.table.log'),
      DatabaseEnum.tinylog,
      null)
    tinylog.supportedSource = [DatabaseEnum.clickhosue];
    logEngines.push(tinylog);

    // StripeLog
    const stripelog = DatabaseModel.builder(TranslateUtils.getValue('common.stripelog'),
      TranslateUtils.getValue('tooltip.table.log'),
      DatabaseEnum.stripelog,
      null);
    stripelog.supportedSource = [DatabaseEnum.clickhosue];
    logEngines.push(stripelog);
    logTable.engines = logEngines;
    tableEngines.push(logTable);

    const integrationTable = new DatabaseModel();
    integrationTable.name = StringUtils.format('{0}',
      [TranslateUtils.getValue('common.integration')]);
    integrationTable.description = TranslateUtils.getValue('tooltip.table.integration');
    integrationTable.supportedSource = [DatabaseEnum.clickhosue];
    const integrationEngines = new Array();

    // Kafka
    const kafkaProperties = new Array();
    kafkaProperties.push(PropertyModel.builder('broker',
      TranslateUtils.getValue('common.broker'),
      TranslateUtils.getValue('placeholder.broker'),
      TranslateUtils.getValue('tooltip.property.broker'),
      'kafka_broker_list'));
    kafkaProperties.push(PropertyModel.builder('kafka',
      TranslateUtils.getValue('common.topic'),
      TranslateUtils.getValue('placeholder.topic'),
      TranslateUtils.getValue('tooltip.property.topic'),
      'kafka_topic_list'));
    kafkaProperties.push(PropertyModel.builder('group',
      TranslateUtils.getValue('common.group'),
      TranslateUtils.getValue('placeholder.group'),
      TranslateUtils.getValue('tooltip.property.group'),
      'kafka_group_name'));
    kafkaProperties.push(PropertyModel.builder('format',
      TranslateUtils.getValue('common.format'),
      TranslateUtils.getValue('placeholder.format'),
      TranslateUtils.getValue('tooltip.property.format'),
      'kafka_format'));
    const kafka = DatabaseModel.builder(DatabaseEnum.kafka.toString(),
      TranslateUtils.getValue('tooltip.table.kafka'),
      DatabaseEnum.kafka,
      kafkaProperties,
      false,
      PropertyEnum.key);
    kafka.supportedSource = [DatabaseEnum.clickhosue];
    integrationEngines.push(kafka);

    // HDFS
    const hdfsProperties = new Array();
    hdfsProperties.push(PropertyModel.builder('uri',
      TranslateUtils.getValue('common.uri'),
      TranslateUtils.getValue('placeholder.uri'),
      TranslateUtils.getValue('tooltip.property.uri'),
      null,
      false));
    hdfsProperties.push(PropertyModel.builder('format',
      TranslateUtils.getValue('common.format'),
      TranslateUtils.getValue('placeholder.format'),
      TranslateUtils.getValue('tooltip.property.format'),
      null,
      false));
    const hdfs = DatabaseModel.builder(DatabaseEnum.hdfs.toString(),
      TranslateUtils.getValue('tooltip.table.hdfs'),
      DatabaseEnum.hdfs,
      hdfsProperties,
      false,
      PropertyEnum.name);
    hdfs.supportedSource = [DatabaseEnum.clickhosue];
    integrationEngines.push(hdfs);

    // JDBC
    const jdbcProperties = new Array();
    jdbcProperties.push(PropertyModel.builder('uri',
      TranslateUtils.getValue('common.uri'),
      TranslateUtils.getValue('placeholder.uri'),
      TranslateUtils.getValue('tooltip.property.uri'),
      null,
      false));
    jdbcProperties.push(PropertyModel.builder('database',
      TranslateUtils.getValue('common.database'),
      TranslateUtils.getValue('placeholder.database'),
      TranslateUtils.getValue('tooltip.property.database'),
      null,
      false));
    jdbcProperties.push(PropertyModel.builder('table',
      TranslateUtils.getValue('common.table'),
      TranslateUtils.getValue('placeholder.table'),
      TranslateUtils.getValue('tooltip.property.table'),
      null,
      false));
    const jdbc = DatabaseModel.builder(DatabaseEnum.jdbc.toString(),
      TranslateUtils.getValue('tooltip.table.jdbc'),
      DatabaseEnum.jdbc,
      jdbcProperties,
      false,
      PropertyEnum.name);
    jdbc.supportedSource = [DatabaseEnum.clickhosue];
    integrationEngines.push(jdbc);

    // SQLite
    const sqliteProperties = new Array();
    sqliteProperties.push(PropertyModel.builder('path',
      TranslateUtils.getValue('common.path'),
      TranslateUtils.getValue('placeholder.path'),
      TranslateUtils.getValue('tooltip.property.path'),
      null,
      false));
    sqliteProperties.push(PropertyModel.builder('table',
      TranslateUtils.getValue('common.table'),
      TranslateUtils.getValue('placeholder.table'),
      TranslateUtils.getValue('tooltip.property.table'),
      null,
      false));
    const sqlite = DatabaseModel.builder(DatabaseEnum.sqlite.toString(),
      TranslateUtils.getValue('tooltip.table.sqlite'),
      DatabaseEnum.sqlite,
      sqliteProperties,
      false,
      PropertyEnum.name);
    sqlite.supportedSource = [DatabaseEnum.clickhosue];
    integrationEngines.push(sqlite);

    // ODBC
    const odbcProperties = new Array();
    odbcProperties.push(PropertyModel.builder('path',
      TranslateUtils.getValue('common.path'),
      TranslateUtils.getValue('placeholder.setting'),
      TranslateUtils.getValue('tooltip.property.setting.odbc'),
      null,
      false));
    odbcProperties.push(PropertyModel.builder('database',
      TranslateUtils.getValue('common.database'),
      TranslateUtils.getValue('placeholder.database'),
      TranslateUtils.getValue('tooltip.property.database'),
      null,
      false));
    odbcProperties.push(PropertyModel.builder('table',
      TranslateUtils.getValue('common.table'),
      TranslateUtils.getValue('placeholder.table'),
      TranslateUtils.getValue('tooltip.property.table'),
      null,
      false));
    const odbc = DatabaseModel.builder(DatabaseEnum.odbc.toString(),
      TranslateUtils.getValue('tooltip.table.odbc'),
      DatabaseEnum.odbc,
      odbcProperties,
      false,
      PropertyEnum.name);
    odbc.supportedSource = [DatabaseEnum.clickhosue];
    integrationEngines.push(odbc);

    // MongoDB
    const mongodbProperties = new Array();
    mongodbProperties.push(PropertyModel.builder('uri',
      TranslateUtils.getValue('common.uri'),
      TranslateUtils.getValue('placeholder.uri'),
      TranslateUtils.getValue('tooltip.property.mongodb.uri'),
      null,
      false,
      true));
    mongodbProperties.push(PropertyModel.builder('database',
      TranslateUtils.getValue('common.database'),
      TranslateUtils.getValue('tooltip.property.mongodb.database'),
      TranslateUtils.getValue('tooltip.property.mongodb.database'),
      null,
      false,
      true));
    mongodbProperties.push(PropertyModel.builder('collection',
      TranslateUtils.getValue('common.collection'),
      TranslateUtils.getValue('placeholder.collection'),
      TranslateUtils.getValue('tooltip.property.mongodb.collection'),
      null,
      false,
      true));
    mongodbProperties.push(PropertyModel.builder('username',
      TranslateUtils.getValue('common.username'),
      TranslateUtils.getValue('tooltip.property.mongodb.username'),
      TranslateUtils.getValue('tooltip.property.mongodb.username'),
      null,
      false,
      true));
    mongodbProperties.push(PropertyModel.builder('password',
      TranslateUtils.getValue('common.password'),
      TranslateUtils.getValue('tooltip.property.mongodb.password'),
      TranslateUtils.getValue('tooltip.property.mongodb.password'),
      null,
      false,
      true));
    mongodbProperties.push(PropertyModel.builder('options',
      TranslateUtils.getValue('common.options'),
      TranslateUtils.getValue('tooltip.property.mongodb.options'),
      TranslateUtils.getValue('tooltip.property.mongodb.options'),
      null,
      false,
      false));
    const mongodb = DatabaseModel.builder(DatabaseEnum.mongodb.toString(),
      TranslateUtils.getValue('tooltip.table.mongodb'),
      DatabaseEnum.mongodb,
      mongodbProperties,
      false,
      PropertyEnum.name);
    mongodb.supportedSource = [DatabaseEnum.clickhosue];
    integrationEngines.push(mongodb);

    // MySQL
    const mysqlProperties = new Array();
    mysqlProperties.push(PropertyModel.builder('uri',
      TranslateUtils.getValue('common.uri'),
      TranslateUtils.getValue('placeholder.uri'),
      TranslateUtils.getValue('tooltip.property.mongodb.uri'),
      null,
      false,
      true));
    mysqlProperties.push(PropertyModel.builder('database',
      TranslateUtils.getValue('common.database'),
      TranslateUtils.getValue('placeholder.database'),
      TranslateUtils.getValue('tooltip.property.database'),
      null,
      false));
    mysqlProperties.push(PropertyModel.builder('table',
      TranslateUtils.getValue('common.table'),
      TranslateUtils.getValue('placeholder.table'),
      TranslateUtils.getValue('tooltip.property.table'),
      null,
      false));
    mysqlProperties.push(PropertyModel.builder('username',
      TranslateUtils.getValue('common.username'),
      TranslateUtils.getValue('tooltip.property.username'),
      TranslateUtils.getValue('tooltip.property.username'),
      null,
      false,
      true));
    mysqlProperties.push(PropertyModel.builder('password',
      TranslateUtils.getValue('common.password'),
      TranslateUtils.getValue('tooltip.property.password'),
      TranslateUtils.getValue('tooltip.property.password'),
      null,
      false,
      true));
    const mysql = DatabaseModel.builder(DatabaseEnum.mysql.toString(),
      TranslateUtils.getValue('tooltip.table.mysql'),
      DatabaseEnum.mysql,
      mysqlProperties,
      false,
      PropertyEnum.name);
    mysql.supportedSource = [DatabaseEnum.clickhosue];
    integrationEngines.push(mysql);

    // Hive
    integrationEngines.push(HiveTableEngine);

    integrationTable.engines = integrationEngines;
    tableEngines.push(integrationTable);
    return tableEngines;
  }
}
