import { Injectable } from '@angular/core';
import { DatabaseEnum } from '@renderer/enum/database.enum';
import { DatabaseModel } from '@renderer/model/database.model';
import { StringUtils } from '@renderer/utils/string.utils';
import { TranslateUtils } from '@renderer/utils/translate.utils';
import { PropertyModel } from '@renderer/model/property.model';
import { PropertyEnum } from '@renderer/enum/property.enum';

const tableConfigJson = require('./table.config.json');

@Injectable()
export class TableConfig {
  getConfig(): DatabaseModel[] {
    const tableEngines = new Array();
    /**
     * Log Engine
     */
    const logTable = new DatabaseModel();
    logTable.name = StringUtils.format('{0}',
      [TranslateUtils.getValue('common.log')]);
    logTable.description = TranslateUtils.getValue('tooltip.table.log');
    const logEngines = new Array();
    // Log
    logEngines.push(DatabaseModel.builder(TranslateUtils.getValue('common.log'),
      TranslateUtils.getValue('tooltip.table.log'),
      DatabaseEnum.log,
      null));
    // TinyLog
    logEngines.push(DatabaseModel.builder(TranslateUtils.getValue('common.tinylog'),
      TranslateUtils.getValue('tooltip.table.log'),
      DatabaseEnum.tinylog,
      null));
    // StripeLog
    logEngines.push(DatabaseModel.builder(TranslateUtils.getValue('common.stripelog'),
      TranslateUtils.getValue('tooltip.table.log'),
      DatabaseEnum.stripelog,
      null));
    logTable.engines = logEngines;
    tableEngines.push(logTable);
    const integrationTable = new DatabaseModel();
    integrationTable.name = StringUtils.format('{0}',
      [TranslateUtils.getValue('common.integration')]);
    integrationTable.description = TranslateUtils.getValue('tooltip.table.integration');
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
    integrationEngines.push(DatabaseModel.builder(DatabaseEnum.kafka.toString(),
      TranslateUtils.getValue('tooltip.table.kafka'),
      DatabaseEnum.kafka,
      kafkaProperties,
      false,
      PropertyEnum.key));
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
    integrationEngines.push(DatabaseModel.builder(DatabaseEnum.hdfs.toString(),
      TranslateUtils.getValue('tooltip.table.hdfs'),
      DatabaseEnum.hdfs,
      hdfsProperties,
      false,
      PropertyEnum.name));
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
    integrationEngines.push(DatabaseModel.builder(DatabaseEnum.jdbc.toString(),
      TranslateUtils.getValue('tooltip.table.jdbc'),
      DatabaseEnum.jdbc,
      jdbcProperties,
      false,
      PropertyEnum.name));
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
    integrationEngines.push(DatabaseModel.builder(DatabaseEnum.sqlite.toString(),
      TranslateUtils.getValue('tooltip.table.sqlite'),
      DatabaseEnum.sqlite,
      sqliteProperties,
      false,
      PropertyEnum.name));
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
    integrationEngines.push(DatabaseModel.builder(DatabaseEnum.odbc.toString(),
      TranslateUtils.getValue('tooltip.table.odbc'),
      DatabaseEnum.odbc,
      odbcProperties,
      false,
      PropertyEnum.name));
    integrationTable.engines = integrationEngines;
    tableEngines.push(integrationTable);
    return tableEngines;
  }

  getConfigFromJson(): DatabaseModel[] {
    return tableConfigJson;
  }
}
