import { Injectable } from '@angular/core';
import { RequestModel } from '@renderer/model/request.model';
import { ResponseModel } from '@renderer/model/response.model';
import { BaseService } from '@renderer/services/base.service';
import { HttpService } from '@renderer/services/http.service';
import { StringUtils } from '@renderer/utils/string.utils';
import { DatasourceService } from '../management/datasource.service';
import { TableService } from '../management/table.service';
import { SshService } from '@renderer/services/ssh.service';
import { BasicService } from '@renderer/services/system/basic.service';
import { ForwardService } from '@renderer/services/forward.service';

@Injectable()
export class MigrateService extends ForwardService implements BaseService {
  constructor(private tableService: TableService,
              private datasourceService: DatasourceService,
              httpService: HttpService,
              sshService: SshService,
              basicService: BasicService) {
    super(httpService, sshService, basicService);
  }

  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
    return this.forward(request, sql);
  }

  async migrate(source, target): Promise<ResponseModel> {
    let response;
    let targetDatabase = target.database;
    let targetTable = target.table;
    if (StringUtils.isEmpty(targetDatabase)) {
      targetDatabase = source.database;
    }
    if (StringUtils.isEmpty(targetTable)) {
      targetTable = source.table;
    }
    const sourceRequest = new RequestModel();
    sourceRequest.config = await this.datasourceService.getByAliasAsync(source.datasource);
    const targetRequest = new RequestModel();
    targetRequest.config = await this.datasourceService.getByAliasAsync(target.datasource);
    // step 1: check table from target server
    let tableExists = false;
    const cr = await this.tableService.check(targetRequest, targetDatabase, source.table);
    if (cr?.status) {
      if (cr.data?.columns.length > 0) {
        tableExists = true;
      } else {
        response = cr;
      }
    }
    // step 2: get table ddl to source server
    let tableDdl;
    const sql = StringUtils.format('SHOW CREATE TABLE `{0}`.`{1}`', [source.database, source.table]);
    const gr = await this.getResponse(sourceRequest, sql);
    if (gr?.status) {
      if (gr.data?.columns.length > 0) {
        tableDdl = gr.data.columns[0].statement;
      } else {
        response = gr;
      }
    }
    // step 3: replace table name
    if (StringUtils.isNotEmpty(tableDdl)) {
      tableDdl = tableDdl.replace(StringUtils.format('{0}.{1}', [source.database, source.table]),
        StringUtils.format('`{0}`.`{1}`', [targetDatabase, targetTable]));
    }
    // step 4: create table on target server
    let tableCreate = false;
    if (!tableExists) {
      const gqr = await this.getResponse(targetRequest, tableDdl);
      if (gqr?.status) {
        tableCreate = true;
      } else {
        response = gqr;
      }
    }
    // step 5: migrate data
    if ((tableExists && !tableCreate) || (!tableExists && tableCreate)) {
      const sql = this.builderDDL(source, target, targetDatabase, targetTable, sourceRequest);
      response = await this.getResponse(targetRequest, sql);
    }
    return response;
  }

  builderDDL(source, target, targetDatabase, targetTable, sourceRequest: RequestModel): string {
    let sql;
    if (source.datasource === target.datasource) {
      sql = StringUtils.format(`
    INSERT INTO {0}
    SELECT * FROM {1}
    `, [
        StringUtils.format('`{0}`.`{1}`', [targetDatabase, targetTable]),
        StringUtils.format('`{0}`.`{1}`', [source.database, source.table])
      ]);
    } else {
      const username = StringUtils.isEmpty(sourceRequest.config.username) ? '' : sourceRequest.config.username;
      const password = StringUtils.isEmpty(sourceRequest.config.password) ? '' : sourceRequest.config.password;
      sql = StringUtils.format(`
    INSERT INTO {0}
    SELECT * FROM remote('{1}', {2}, {3}, '{4}', '{5}')
    `, [
        StringUtils.format('{0}.{1}', [targetDatabase, targetTable]),
        sourceRequest.config.host,
        source.database,
        source.table,
        username,
        password]);
    }
    return sql;
  }
}
