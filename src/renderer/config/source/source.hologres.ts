import { DatabaseModel } from "@renderer/model/database.model";
import { TranslateUtils } from "@renderer/utils/translate.utils";
import { DatabaseEnum } from "@renderer/enum/database.enum";

const HologresDataSource = DatabaseModel.builder(TranslateUtils.getValue('common.hologres'),
  TranslateUtils.getValue('tooltip.source.hologres'),
  DatabaseEnum.hologres,
  null,
  true,
  null,
  './renderer/assets/icon/source/Hologres.svg');

export { HologresDataSource };
