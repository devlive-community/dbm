import { Injectable } from '@angular/core';
import { PropertyEnum } from '@renderer/enum/property.enum';
import { ColumnModel } from '@renderer/model/column.model';
import { DatabaseModel } from '@renderer/model/database.model';
import { PropertyModel } from '@renderer/model/property.model';
import { RequestModel } from '@renderer/model/request.model';
import { ResponseModel } from '@renderer/model/response.model';
import { BaseService } from '@renderer/services/base.service';
import { HttpService } from '@renderer/services/http.service';
import { SqlUtils } from '@renderer/utils/sql.utils';
import { StringUtils } from '@renderer/utils/string.utils';
import { UrlUtils } from '@renderer/utils/url.utils';

@Injectable()
export class TableService implements BaseService {
    constructor(private httpService: HttpService) {
    }

    getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
        return this.httpService.post(UrlUtils.formatUrl(request), sql);
    }

    getAll(request: RequestModel, database: string): Promise<ResponseModel> {
        const sql = StringUtils.format('SELECT name, engine FROM system.tables WHERE database = \'{0}\'', [database]);
        return this.getResponse(request, sql);
    }

    check(request: RequestModel, database: string, table: string): Promise<ResponseModel> {
        const sql = StringUtils.format(`
      SELECT
        name
      FROM
        system.tables
      WHERE
        database = '{0}' AND name = '{1}'
        `, [database, table])
        return this.getResponse(request, sql);
    }

    createTable(request: RequestModel, database: DatabaseModel, columns: ColumnModel[]): Promise<ResponseModel> {
        let sql = StringUtils.format('CREATE TABLE {0} (\n', [SqlUtils.getTableName(database.database, database.name)]);
        sql += StringUtils.format('{0}\n', [this.builderColumnsToString(columns)])
        sql += StringUtils.format(') {0}\n', [this.builderEngine(database)])
        if (database?.property?.properties) {
            sql += this.builderProperties(database?.property?.properties)
        }
        return this.getResponse(request, sql);
    }

    delete(request: RequestModel, value: DatabaseModel): Promise<ResponseModel> {
        const sql = StringUtils.format('DROP TABLE {0}', [SqlUtils.getTableName(value.database, value.name)]);
        return this.getResponse(request, sql);
    }

    rename(request: RequestModel, value: DatabaseModel, newName: string): Promise<ResponseModel> {
        const sql = StringUtils.format('RENAME TABLE {0} TO {1}', [SqlUtils.getTableName(value.database, value.name), SqlUtils.getTableName(value.database, newName)]);
        return this.getResponse(request, sql);
    }

    truncate(request: RequestModel, value: DatabaseModel): Promise<ResponseModel> {
        const sql = StringUtils.format('TRUNCATE TABLE {0}', [SqlUtils.getTableName(value.database, value.name)]);
        return this.getResponse(request, sql);
    }

    clean(request: RequestModel, value: DatabaseModel, partition: string): Promise<ResponseModel> {
        const sql = StringUtils.format('ALTER TABLE {0} DROP PARTITION \'{1}\'', [SqlUtils.getTableName(value.database, value.name), partition]);
        return this.getResponse(request, sql);
    }

    optimize(request: RequestModel, value: DatabaseModel, partition: string, final: boolean): Promise<ResponseModel> {
        let sql = StringUtils.format('OPTIMIZE TABLE {0} PARTITION \'{1}\'', [SqlUtils.getTableName(value.database, value.name), partition]);
        if (final) {
            sql = StringUtils.format('{0} FINAL', [sql])
        }
        return this.getResponse(request, sql);
    }

    getCreateStatement(request: RequestModel, value: DatabaseModel): Promise<ResponseModel> {
        const sql = StringUtils.format('SHOW CREATE TABLE {0}', [SqlUtils.getTableName(value.database, value.name)]);
        return this.getResponse(request, sql);
    }

    getPartitions(request: RequestModel, value: DatabaseModel): Promise<ResponseModel> {
        const sql = StringUtils.format(`SELECT
        DISTINCT "partition" AS "partition",
        "database",
        "table",
        name,
        active
      FROM
        "system".parts
      WHERE
        "database" = '{0}'
        AND "table" = '{1}'
      ORDER BY
        modification_time DESC`, [value.database, value.name]);
        return this.getResponse(request, sql);
    }

    getPreview(request: RequestModel, value: DatabaseModel): Promise<ResponseModel> {
        const sql = StringUtils.format(`SELECT * FROM {0} LIMIT 10`, [SqlUtils.getTableName(value.database, value.name)]);
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
        let dStr: string;
        if (value.empty) {
            dStr = StringUtils.format('    {0} Nullable({1})', [value.name, value.type])
        } else {
            dStr = StringUtils.format('    {0} {1}', [value.name, value.type])
        }
        const endStr = end ? ',\n' : ''
        if (StringUtils.isNotEmpty(value.description)) {
            column = StringUtils.format(`    {0} COMMENT '{1}' {2}`, [dStr, value.description, endStr])
        } else {
            column = StringUtils.format('    {0} {1}', [dStr, endStr])
        }
        return column
    }

    /**
     * Build key-value pairs based on configured table engine parameters
     * @param properties Configuration parameters
     * @returns sql string
     */
    private builderProperties(properties: PropertyModel[]): string {
        let substr: string = '';
        const map = this.flatProperties(properties);
        map.forEach((v, k) => {
            if (k !== 'type') {
                substr += StringUtils.format('\n  {0} = \'{1}\',', [k, v]);
            }
        });
        if (StringUtils.isNotEmpty(substr)) {
            substr = StringUtils.format('SETTINGS {0}', [substr.substring(0, substr.length - 1)]);
        }
        return substr;
    }

    private builderEngine(configure: DatabaseModel): string {
        let sql: string = '';
        const prefix = '\nENGINE = ';
        switch (configure.propertyType) {
            case PropertyEnum.key:
            default:
                sql = StringUtils.format('{0} {1}()', [prefix, configure.type]);
                break;
            case PropertyEnum.name:
                const substr = configure.property.properties
                    .flatMap(element => StringUtils.format('\'{0}\'', [element.value]))
                    .join(', ');
                sql = StringUtils.format('{0} {1}({2})', [prefix, configure.type, substr]);
                break;
        }
        return sql;
    }

    private flatProperties(properties: PropertyModel[]): Map<string, string> {
        const map = new Map<string, string>();
        properties
            .filter(p => p.isSetting === undefined || p.isSetting)
            .forEach(p => {
                if (StringUtils.isNotEmpty(p.origin)) {
                    map.set('type', PropertyEnum.key)
                    map.set(p.origin, p.value)
                } else {
                    map.set('type', PropertyEnum.name)
                    map.set(p.name, p.value)
                }
            });
        return map;
    }
}
