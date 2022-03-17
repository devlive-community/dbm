import { Injectable } from '@angular/core';
import { DatabaseEnum } from '@renderer/enum/database.enum';
import { DatabaseModel } from '@renderer/model/database.model';
import { StringUtils } from '@renderer/utils/string.utils';
import { TranslateUtils } from '@renderer/utils/translate.utils';

@Injectable()
export class SourceTypeConfig {
  getConfig(): DatabaseModel[] {
    const typeEngines = new Array();
    const basicEngine = new DatabaseModel();
    basicEngine.name = StringUtils.format('{0}',
      [TranslateUtils.getValue('common.basic')]);
    basicEngine.description = TranslateUtils.getValue('tooltip.source.basic');
    const basicEngines = new Array();
    // ClickHouse
    basicEngines.push(DatabaseModel.builder(TranslateUtils.getValue('common.clickhouse'),
      TranslateUtils.getValue('tooltip.source.clickhouse'),
      DatabaseEnum.clickhosue,
      null,
      false,
      null,
      './renderer/assets/icon/source/clickhouse.svg'));
    basicEngine.engines = basicEngines;
    typeEngines.push(basicEngine);
    return typeEngines;
  }
}
