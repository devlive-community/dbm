import { Injectable } from '@angular/core';
import { DatabaseModel } from '@renderer/model/database.model';
import { RequestModel } from '@renderer/model/request.model';
import { ResponseModel } from '@renderer/model/response.model';
import { BaseService } from '@renderer/services/base.service';
import { HttpService } from '@renderer/services/http.service';
import { SqlUtils } from '@renderer/utils/sql.utils';
import { StringUtils } from '@renderer/utils/string.utils';
import { ColumnModel } from '@renderer/model/column.model';
import { ColumnUtils } from '@renderer/utils/column.utils';
import { SshService } from '@renderer/services/ssh.service';
import { BasicService } from '@renderer/services/system/basic.service';
import { ForwardService } from '@renderer/services/forward.service';
import { FactoryService } from "@renderer/services/factory.service";
import { MySQLService } from "@renderer/services/plugin/mysql.service";
import { DatabaseEnum } from "@renderer/enum/database.enum";

@Injectable()
export class ColumnService extends ForwardService implements BaseService {
  constructor(httpService: HttpService,
              factoryService: FactoryService,
              sshService: SshService,
              basicService: BasicService,
              mysqlService: MySQLService) {
    super(basicService, factoryService, httpService, sshService, null, mysqlService);
  }

  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
    return this.forward(request, sql);
  }

  getPreview(request: RequestModel, value: DatabaseModel): Promise<ResponseModel> {
    const sql = StringUtils.format(`SELECT {0}
                                    FROM {1} LIMIT 10`, [value.name, SqlUtils.getTableName(value.database, value.table)]);
    return this.getResponse(request, sql);
  }

  delete(request: RequestModel, value: DatabaseModel): Promise<ResponseModel> {
    const sql = StringUtils.format('ALTER TABLE {0} DROP COLUMN `{1}`', [SqlUtils.getTableName(value.database, value.table), value.name]);
    return this.getResponse(request, sql);
  }

  comment(request: RequestModel, value: DatabaseModel, comment: string, originColumnType: string): Promise<ResponseModel> {
    let sql;
    if (request.config.type === DatabaseEnum.mysql) {
      sql = StringUtils.format(this.factoryService.forward(request.config.type).columnAddComment,
        [SqlUtils.getTableName(value.database, value.table), value.name, value.name, originColumnType, comment]);
      console.log(sql);
    }
    else {
      sql = StringUtils.format(this.factoryService.forward(request.config.type).columnAddComment,
        [SqlUtils.getTableName(value.database, value.table), value.name, StringUtils.appendBackslash(comment)]);
    }
    return this.getResponse(request, sql);
  }

  rename(request: RequestModel, value: DatabaseModel, newName: string, originColumnType: string): Promise<ResponseModel> {
    let sql;
    if (request.config.type === DatabaseEnum.mysql) {
      sql = StringUtils.format(this.factoryService.forward(request.config.type).columnRename,
        [SqlUtils.getTableName(value.database, value.table), value.name, newName, originColumnType]);
    } else {
      sql = StringUtils.format(this.factoryService.forward(request.config.type).columnRename,
        [SqlUtils.getTableName(value.database, value.table), value.name, newName]);
    }
    return this.getResponse(request, sql);
  }

  create(request: RequestModel, value: DatabaseModel, columns: ColumnModel[]): Promise<ResponseModel> {
    const sql = StringUtils.format('ALTER TABLE {0} ADD COLUMN {1}',
      [SqlUtils.getTableName(value.database, value.table), ColumnUtils.builderColumnsToString(columns)]);
    return this.getResponse(request, sql);
  }

  getAll(request: RequestModel, value: DatabaseModel): Promise<ResponseModel> {
    const sql = StringUtils.format('DESC {0}', [SqlUtils.getTableName(value.database, value.table)]);
    return this.getResponse(request, sql);
  }
}
