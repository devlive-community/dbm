import { DatabaseModel } from "@renderer/model/database.model";
import { TranslateUtils } from "@renderer/utils/translate.utils";
import { DatabaseEnum } from "@renderer/enum/database.enum";

const DefaultEngine = DatabaseModel.builder(TranslateUtils.getValue('common.default'),
  TranslateUtils.getValue('tooltip.database.default'),
  DatabaseEnum.none,
  null);
DefaultEngine.supportedSource = [DatabaseEnum.mysql];

DefaultEngine.characterAndCollationConfigure.enable = true;
DefaultEngine.characterAndCollationConfigure.characterSetConfigure.enable = true;
DefaultEngine.characterAndCollationConfigure.collationConfigure.enable = true;

export {
  DefaultEngine
}
