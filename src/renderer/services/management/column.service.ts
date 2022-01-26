import { Injectable } from '@angular/core';
import { DatabaseModel } from '@renderer/model/database.model';
import { RequestModel } from '@renderer/model/request.model';
import { ResponseModel } from '@renderer/model/response.model';
import { BaseService } from '@renderer/services/base.service';
import { HttpService } from '@renderer/services/http.service';
import { SqlUtils } from '@renderer/utils/sql.utils';
import { StringUtils } from '@renderer/utils/string.utils';
import { UrlUtils } from '@renderer/utils/url.utils';

@Injectable()
export class ColumnService implements BaseService {
    constructor(private httpService: HttpService) {
    }

    getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
        return this.httpService.post(UrlUtils.formatUrl(request), sql);
    }

    getPreview(request: RequestModel, value: DatabaseModel): Promise<ResponseModel> {
        const sql = StringUtils.format(`SELECT {0} FROM {1} LIMIT 10`, [value.name, SqlUtils.getTableName(value.database, value.table)]);
        return this.getResponse(request, sql);
    }

    delete(request: RequestModel, value: DatabaseModel): Promise<ResponseModel> {
        const sql = StringUtils.format('ALTER TABLE {0} DROP COLUMN {1}', [SqlUtils.getTableName(value.database, value.table), value.name]);
        return this.getResponse(request, sql);
    }
}