import { Injectable } from '@angular/core';
import { DatabaseEnum } from '@renderer/enum/database.enum';
import { DatabaseModel } from '@renderer/model/database.model';
import { StringUtils } from '@renderer/utils/string.utils';
import { TranslateUtils } from '@renderer/utils/translate.utils';
import { PropertyModel } from '@renderer/model/property.model';

@Injectable()
export class DatabaseConfig {
  getConfig(): DatabaseModel[] {
    const databaseEngines = new Array();
    /**
     * basic
     */
    const basicDatabase = new DatabaseModel();
    basicDatabase.name = StringUtils.format('{0} {1}',
      [TranslateUtils.getValue('common.database'), TranslateUtils.getValue('common.engine')]);
    basicDatabase.description = basicDatabase.name;
    const defaultEngines = new Array();
    defaultEngines.push(DatabaseModel.builder(TranslateUtils.getValue('common.default'),
      TranslateUtils.getValue('tooltip.database.default'),
      DatabaseEnum.none,
      null));
    defaultEngines.push(DatabaseModel.builder(TranslateUtils.getValue('common.atomic'),
      TranslateUtils.getValue('tooltip.database.atomic'),
      DatabaseEnum.atomic,
      null));
    defaultEngines.push(DatabaseModel.builder(TranslateUtils.getValue('common.lazy'),
      TranslateUtils.getValue('tooltip.database.lazy'),
      DatabaseEnum.lazy,
      null));
    // mysql
    const properties = new Array();
    properties.push(PropertyModel.builder('host',
      TranslateUtils.getValue('common.host'),
      TranslateUtils.getValue('placeholder.host'),
      TranslateUtils.getValue('tooltip.property.host')));
    properties.push(PropertyModel.builder('port',
      TranslateUtils.getValue('common.port'),
      TranslateUtils.getValue('placeholder.port'),
      TranslateUtils.getValue('tooltip.property.port')));
    properties.push(PropertyModel.builder('database',
      TranslateUtils.getValue('common.database'),
      TranslateUtils.getValue('placeholder.database'),
      TranslateUtils.getValue('tooltip.property.database')));
    properties.push(PropertyModel.builder('username',
      TranslateUtils.getValue('common.username'),
      TranslateUtils.getValue('placeholder.username'),
      TranslateUtils.getValue('tooltip.property.username')));
    properties.push(PropertyModel.builder('password',
      TranslateUtils.getValue('common.password'),
      TranslateUtils.getValue('placeholder.password'),
      TranslateUtils.getValue('tooltip.property.password')));
    defaultEngines.push(DatabaseModel.builder(TranslateUtils.getValue('common.mysql'),
      TranslateUtils.getValue('tooltip.database.mysql'),
      DatabaseEnum.mysql,
      properties));
    basicDatabase.engines = defaultEngines;
    databaseEngines.push(basicDatabase);
    /**
     * experimental
     */
    const experimentalDatabase = new DatabaseModel();
    experimentalDatabase.name = StringUtils.format('{0} {1}({2})',
      [TranslateUtils.getValue('common.database'),
        TranslateUtils.getValue('common.engine'),
        TranslateUtils.getValue('common.experimental')]);
    experimentalDatabase.description = TranslateUtils.getValue('tooltip.experimental');
    databaseEngines.push(experimentalDatabase);
    const experimentalEngines = new Array();
    const materializedMysql = DatabaseModel.builder(TranslateUtils.getValue('common.materialized_mysql'),
      TranslateUtils.getValue('tooltip.database.materialized_mysql'),
      DatabaseEnum.materialized_mysql,
      properties,
      true);
    experimentalEngines.push(materializedMysql);
    experimentalDatabase.engines = experimentalEngines;
    return databaseEngines;
  }
}
