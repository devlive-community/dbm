import { Injectable } from '@angular/core';
import { LogicEnum } from '@renderer/enum/logic.enum';
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
import { TableTtlModel } from '@renderer/model/table/table.ttl.model';
import { SshService } from '@renderer/services/ssh.service';
import { BasicService } from '@renderer/services/system/basic.service';
import { ForwardService } from '@renderer/services/forward.service';

@Injectable()
export class TableService extends ForwardService implements BaseService {
  constructor(httpService: HttpService,
              sshService: SshService,
              basicService: BasicService) {
    super(httpService, sshService, basicService);
  }

  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
    return this.forward(request, sql);
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
        `, [database, table]);
    return this.getResponse(request, sql);
  }

  getSize(request: RequestModel, database: string, table: string): Promise<ResponseModel> {
    const sql = StringUtils.format(`
      SELECT
        database AS db, table AS name, SUM(bytes_on_disk) AS tableUsedBytes,
        formatReadableSize(sum(bytes_on_disk)) AS value,
        if(SUM(bytes_on_disk) > (1024*1024*1024*50), 1, 0) AS flag
        FROM system.parts
      WHERE database = '{0}' AND name = '{1}'
      GROUP BY db, name
        `, [database, table]);
    return this.getResponse(request, sql);
  }

  createTable(request: RequestModel, configure: DatabaseModel, columns: ColumnModel[]): Promise<ResponseModel> {
    let sql = StringUtils.format('CREATE TABLE {0} (\n', [SqlUtils.getTableName(configure.database, configure.targetName)]);
    sql += StringUtils.format('{0}\n', [this.builderColumnsToString(columns)]);
    sql += StringUtils.format(') {0}\n', [this.builderEngine(configure)]);
    const mergeProperties = this.mergeProperties(configure);
    sql += this.builderProperties(mergeProperties);
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
    const sql = StringUtils.format('ALTER TABLE {0} DROP PARTITION ID \'{1}\'',
      [SqlUtils.getTableName(value.database, value.name), partition]);
    return this.getResponse(request, sql);
  }

  optimize(request: RequestModel, value: DatabaseModel, partition: string, final: boolean): Promise<ResponseModel> {
    let sql = StringUtils.format('OPTIMIZE TABLE {0} PARTITION \'{1}\'', [SqlUtils.getTableName(value.database, value.name), partition]);
    if (final) {
      sql = StringUtils.format('{0} FINAL', [sql]);
    }
    return this.getResponse(request, sql);
  }

  getCreateStatement(request: RequestModel, value: DatabaseModel): Promise<ResponseModel> {
    const sql = StringUtils.format('SHOW CREATE TABLE {0}', [SqlUtils.getTableName(value.database, value.name)]);
    return this.getResponse(request, sql);
  }

  getPartitions(request: RequestModel, value: DatabaseModel, partition?: string, logic?: LogicEnum): Promise<ResponseModel> {
    let sql = StringUtils.format(`
      SELECT
        DISTINCT "partition" AS "partition", partition_id AS id,
        engine, SUM(rows) AS rows, formatReadableSize(SUM(bytes_on_disk)) AS size
      FROM
        "system".parts
      WHERE
        "database" = '{0}'
        AND "table" = '{1}'
      GROUP BY "partition", partition_id, engine
      ORDER BY "partition" ASC`, [value.database, value.name]);
    if (StringUtils.isNotEmpty(partition) && StringUtils.isNotEmpty(logic)) {
      sql = StringUtils.format(`
      SELECT
        DISTINCT "partition" AS "partition", partition_id AS id,
        engine, SUM(rows) AS rows, formatReadableSize(SUM(bytes_on_disk)) AS size
      FROM
        "system".parts
      WHERE
        "database" = '{0}'
        AND "table" = '{1}'
        AND "partition" {2} '{3}'
      GROUP BY "partition", partition_id, engine
      ORDER BY "partition" ASC`, [value.database, value.name, logic, partition]);
    }
    return this.getResponse(request, sql);
  }

  getPreview(request: RequestModel, value: DatabaseModel): Promise<ResponseModel> {
    const sql = StringUtils.format(`SELECT * FROM {0} LIMIT 10`, [SqlUtils.getTableName(value.database, value.name)]);
    return this.getResponse(request, sql);
  }

  getTimeColumns(request: RequestModel, value: DatabaseModel): Promise<ResponseModel> {
    const sql = StringUtils.format(`
      SELECT name FROM "system"."columns"
      WHERE "database" = '{0}' AND "table" = '{1}' AND type like 'Date%'`,
      [value.database, value.name]);
    return this.getResponse(request, sql);
  }

  modifyTTL(request: RequestModel, value: TableTtlModel): Promise<ResponseModel> {
    let sql;
    if (value.custom) {
      sql = StringUtils.format('ALTER TABLE {0} MODIFY TTL `{1}` {2}',
        [SqlUtils.getTableName(value.database, value.table), value.column, value.value]);
    } else {
      sql = StringUtils.format('ALTER TABLE {0} MODIFY TTL `{1}` + INTERVAL {2} {3}',
        [SqlUtils.getTableName(value.database, value.table), value.column, value.ranger, value.value]);
    }
    return this.getResponse(request, sql);
  }

  getTTL(request: RequestModel, value: TableTtlModel): Promise<ResponseModel> {
    const sql = StringUtils.format(`
    SELECT
      extract(engine_full, 'TTL [\\s\\S]*ETTINGS') AS full,
      REPLACE(REPLACE(full, 'TTL', ''), ' SETTINGS', '') AS ttl,
      splitByString('+', ttl) AS ttlArray,
      trimBoth(arrayElement(ttlArray, 1)) AS "column",
      extract(arrayElement(ttlArray, 2), '\\d+') AS value,
      splitByString('(', replace(arrayElement(ttlArray, 2), 'toInterval', '')) AS rangerArray,
      upperUTF8(arrayElement(rangerArray, 1)) AS ranger
    FROM "system"."tables"
    WHERE "database" = '{0}' AND "name" = '{1}'
    `,
      [value.database, value.table]);
    return this.getResponse(request, sql);
  }

  removeTTL(request: RequestModel, value: TableTtlModel): Promise<ResponseModel> {
    const sql = StringUtils.format(`{0} REMOVE TTL`,
      [SqlUtils.getAlterTablePrefix(value.database, value.table)]);
    return this.getResponse(request, sql);
  }

  builderColumnsToString(columns: ColumnModel[]): string {
    let columnStr = '';
    columns.forEach((value, index) => {
      if (index !== columns.length - 1) {
        columnStr += this.builderColumnToString(value, true);
      } else {
        columnStr += this.builderColumnToString(value, false);
      }
    });
    return columnStr;
  }

  builderColumnToString(value: ColumnModel, end: boolean): string {
    let column: string;
    let dStr: string;
    if (value.empty) {
      dStr = StringUtils.format('    {0} Nullable({1})', [value.name, value.type]);
    } else {
      dStr = StringUtils.format('    {0} {1}', [value.name, value.type]);
    }
    const endStr = end ? ',\n' : '';
    if (StringUtils.isNotEmpty(value.description)) {
      column = StringUtils.format(`    {0} COMMENT '{1}' {2}`, [dStr, value.description, endStr]);
    } else {
      column = StringUtils.format('    {0} {1}', [dStr, endStr]);
    }
    return column;
  }

  /**
   * Build key-value pairs based on configured table engine parameters
   * @param properties Configuration parameters
   * @returns sql string
   */
  private builderProperties(properties: PropertyModel[]): string {
    let substr: string = '';
    // const map = this.flatProperties(properties);
    // map.forEach((v, k) => {
    //     if (k !== 'type') {
    //         substr += StringUtils.format('\n  {0} = \'{1}\',', [k, v]);
    //     }
    // });
    properties
    .filter(p => p.origin !== undefined && StringUtils.isNotEmpty(p.origin))
    .filter(p => p.value !== undefined)
    .forEach(p => {
      substr += StringUtils.format('\n  {0} = \'{1}\',', [p.origin, p.value]);
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
        const substr = configure.properties
        .filter(element => StringUtils.isNotEmpty(element.value))
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
        map.set('type', PropertyEnum.key);
        map.set(p.origin, p.value);
      } else {
        map.set('type', PropertyEnum.name);
        map.set(p.name, p.value);
      }
    });
    return map;
  }

  /**
   * Merges required and optional configurations
   * @param configure Data model configuration
   * @private merges array
   */
  private mergeProperties(configure: DatabaseModel): PropertyModel[] {
    let applyArray = new Array();
    if (configure?.properties) {
      applyArray = applyArray.concat(configure.properties);
    }
    const filterOptionalProperties = configure.optionalProperties?.filter(element => StringUtils.isNotEmpty(element.value));
    if (filterOptionalProperties) {
      applyArray = applyArray.concat(filterOptionalProperties);
    }
    return applyArray;
  }
}
