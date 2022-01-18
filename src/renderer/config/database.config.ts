import { Injectable } from "@angular/core";
import { DatabaseEnum } from "@renderer/enum/database.enum";
import { DatabaseModel } from "@renderer/model/database.model";
import { StringUtils } from "@renderer/utils/string.utils";
import { TranslateUtils } from "@renderer/utils/translate.utils";

@Injectable()
export class DatabaseConfig {

    getConfig(): DatabaseModel[] {
        const databaseEngines = new Array();
        const defaultDatabase = new DatabaseModel();
        defaultDatabase.name = StringUtils.format('{0} {1}',
            [TranslateUtils.getValue('common.database'), TranslateUtils.getValue('common.engine')]);
        defaultDatabase.description = defaultDatabase.name;
        const defaultEngines = new Array();
        defaultEngines.push(DatabaseModel.builder(TranslateUtils.getValue('common.default'),
            TranslateUtils.getValue('tooltip.database.default'),
            DatabaseEnum.none,
            false));
        defaultDatabase.engines = defaultEngines;
        databaseEngines.push(defaultDatabase);

        const experimentalDatabase = new DatabaseModel();
        experimentalDatabase.name = StringUtils.format('{0} {1}({2})',
            [TranslateUtils.getValue('common.database'),
            TranslateUtils.getValue('common.engine'),
            TranslateUtils.getValue('common.experimental')]);
        experimentalDatabase.description = TranslateUtils.getValue('tooltip.experimental');
        databaseEngines.push(experimentalDatabase);
        return databaseEngines;
    }
}
