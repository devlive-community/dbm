import { PropertyModel } from "@renderer/model/property.model";
import { TranslateUtils } from "@renderer/utils/translate.utils";
import { DatabaseModel } from "@renderer/model/database.model";
import { DatabaseEnum } from "@renderer/enum/database.enum";
import { PropertyEnum } from "@renderer/enum/property.enum";

const hiveProperties = new Array();
hiveProperties.push(PropertyModel.builder('uri',
  TranslateUtils.getValue('common.uri'),
  TranslateUtils.getValue('engine.table.hive.uri'),
  TranslateUtils.getValue('engine.table.hive.uri'),
  null,
  false,
  true));
hiveProperties.push(PropertyModel.builder('database',
  TranslateUtils.getValue('common.database'),
  TranslateUtils.getValue('engine.table.hive.database'),
  TranslateUtils.getValue('engine.table.hive.database'),
  null,
  false));
hiveProperties.push(PropertyModel.builder('table',
  TranslateUtils.getValue('common.table'),
  TranslateUtils.getValue('engine.table.hive.table'),
  TranslateUtils.getValue('engine.table.hive.table'),
  null,
  false));
const HiveTableEngine = DatabaseModel.builder(DatabaseEnum.hive.toString(),
  TranslateUtils.getValue('engine.table.hive.description'),
  DatabaseEnum.hive,
  hiveProperties,
  false,
  PropertyEnum.name);

HiveTableEngine.partitionConfigure.enable = true;
HiveTableEngine.supportedSource = [DatabaseEnum.clickhosue];

export { HiveTableEngine };
