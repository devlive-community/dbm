import { Injectable } from '@angular/core';
import { ColumnModel } from '@renderer/model/column.model';
import { DatabaseModel } from '@renderer/model/database.model';
import { RequestModel } from '@renderer/model/request.model';
import { ResponseModel } from '@renderer/model/response.model';
import { BaseService } from '@renderer/services/base.service';
import { HttpService } from '@renderer/services/http.service';
import { StringUtils } from '@renderer/utils/string.utils';
import { UrlUtils } from '@renderer/utils/url.utils';

@Injectable()
export class TableService implements BaseService {
    constructor(private httpService: HttpService) {
    }

    getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
        return this.httpService.post(UrlUtils.formatUrl(request), sql);
    }

    createTable(request: RequestModel, database: DatabaseModel, columns: ColumnModel[]): Promise<ResponseModel> {
        let sql = StringUtils.format('CREATE TABLE {0}.{1} (\n', [database.database, database.name]);
        sql += StringUtils.format('{0}\n', [this.builderColumnsToString(columns)])
        sql += StringUtils.format(') ENGINE = {0}\n', [database.type])
        return this.getResponse(request, sql);
    }

    delete(request: RequestModel, value: DatabaseModel): Promise<ResponseModel> {
        const sql = StringUtils.format('DROP TABLE {0}.{1}', [value.database, value.name]);
        return this.getResponse(request, sql);
    }

    builderColumnsToString(columns: ColumnModel[]): string {
        let columnStr = ''
        columns.forEach((value, index) => {
            if (index !== columns.length - 1) {
                columnStr += this.builderColumnToString(value, true)
            } else {
                columnStr += this.builderColumnToString(value, false)
            }
        })
        return columnStr
    }

    builderColumnToString(value: ColumnModel, end: boolean): string {
        let column: string;
        const dStr = StringUtils.format('    {0} {1}', [value.name, value.type])
        const endStr = end ? ',\n' : ''
        if (StringUtils.isNotEmpty(value.description)) {
            column = StringUtils.format(`    {0} COMMENT '{1}' {2}`, [dStr, value.description, endStr])
        } else {
            column = StringUtils.format('    {0} {1}', [dStr, endStr])
        }
        return column
    }
}
