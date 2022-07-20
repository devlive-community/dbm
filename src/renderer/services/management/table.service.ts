import { Injectable } from '@angular/core';
import { LogicEnum } from '@renderer/enum/logic.enum';
import { ColumnModel } from '@renderer/model/column.model';
import { DatabaseModel } from '@renderer/model/database.model';
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
import { FactoryService } from "@renderer/services/factory.service";
import { MySQLService } from "@renderer/services/plugin/mysql.service";
import { PostgresqlService } from "@renderer/services/plugin/postgresql.service";

@Injectable()
export class TableService extends ForwardService implements BaseService {
  constructor(httpService: HttpService,
              factoryService: FactoryService,
              sshService: SshService,
              basicService: BasicService,
              mysqlService: MySQLService,
              postgresqlService: PostgresqlService) {
    super(basicService, factoryService, httpService, sshService, null, mysqlService, postgresqlService);
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
      SELECT name
      FROM system.tables
      WHERE database = '{0}'
        AND name = '{1}'
    `, [database, table]);
    return this.getResponse(request, sql);
  }

  getSize(request: RequestModel, database: string, table: string): Promise<ResponseModel> {
    const sql = StringUtils.format(`
      SELECT database AS db, table AS name, SUM (bytes_on_disk) AS tableUsedBytes,
        formatReadableSize(sum (bytes_on_disk)) AS value,
        if(SUM (bytes_on_disk) > (1024*1024*1024*50), 1, 0) AS flag
      FROM system.parts
      WHERE database = '{0}' AND name = '{1}'
      GROUP BY db, name
    `, [database, table]);
    return this.getResponse(request, sql);
  }

  createTable(request: RequestModel, configure: DatabaseModel, columns: ColumnModel[]): Promise<ResponseModel> {
    const sql = this.factoryService.forwardBuilder(request.config.type).builder(configure, columns);
    return this.getResponse(request, sql);
  }

  delete(request: RequestModel, value: DatabaseModel): Promise<ResponseModel> {
    const sql = StringUtils.format('DROP TABLE {0}', [SqlUtils.getTableName(value.database, value.name)]);
    return this.getResponse(request, sql);
  }

  rename(request: RequestModel, value: DatabaseModel, newName: string): Promise<ResponseModel> {
    const sql = StringUtils.format('RENAME TABLE {0} TO {1}',
      [SqlUtils.getTableName(value.database, value.name), SqlUtils.getTableName(value.database, newName)]);
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
      SELECT DISTINCT "partition"  AS "partition",
                      partition_id AS id,
                      engine,
                      SUM(rows) AS rows, formatReadableSize(SUM(bytes_on_disk)) AS size
      FROM
        "system".parts
      WHERE
        "database" = '{0}'
        AND "table" = '{1}'
      GROUP BY "partition", partition_id, engine
      ORDER BY "partition" ASC`, [value.database, value.name]);
    if (StringUtils.isNotEmpty(partition) && StringUtils.isNotEmpty(logic)) {
      sql = StringUtils.format(`
        SELECT DISTINCT "partition"  AS "partition",
                        partition_id AS id,
                        engine,
                        SUM(rows) AS rows, formatReadableSize(SUM(bytes_on_disk)) AS size
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
    const sql = StringUtils.format(`SELECT *
                                    FROM {0} LIMIT 10`, [SqlUtils.getTableName(value.database, value.name)]);
    return this.getResponse(request, sql);
  }

  getTimeColumns(request: RequestModel, value: DatabaseModel): Promise<ResponseModel> {
    const sql = StringUtils.format(`
        SELECT name
        FROM "system"."columns"
        WHERE "database" = '{0}'
          AND "table" = '{1}'
          AND type like 'Date%'`,
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
        SELECT extract(engine_full, 'TTL [\\s\\S]*ETTINGS') AS full,
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
}
