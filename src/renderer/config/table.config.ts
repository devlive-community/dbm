import { Injectable } from '@angular/core';
import { DatabaseEnum } from '@renderer/enum/database.enum';
import { DatabaseModel } from '@renderer/model/database.model';
import { StringUtils } from '@renderer/utils/string.utils';
import { TranslateUtils } from '@renderer/utils/translate.utils';
import { PropertyModel } from '@renderer/model/property.model';

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
    logTable.engines = logEngines;
    tableEngines.push(logTable);
    return tableEngines;
  }
}
