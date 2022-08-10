import { DatabaseModel } from "@renderer/model/database.model";
import { TranslateUtils } from "@renderer/utils/translate.utils";
import { DatabaseEnum } from "@renderer/enum/database.enum";
import { PropertyModel } from "@renderer/model/property.model";

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

const PostgreSQLDatabaseEngine = DatabaseModel.builder(TranslateUtils.getValue('common.postgresql'),
  TranslateUtils.getValue('tooltip.database.postgresql'),
  DatabaseEnum.postgresql,
  properties);
PostgreSQLDatabaseEngine.supportedSource = [DatabaseEnum.clickhosue];

export {
  PostgreSQLDatabaseEngine
}
