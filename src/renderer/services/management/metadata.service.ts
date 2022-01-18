import { BaseService } from '@renderer/services/base.service';
import { HttpService } from '@renderer/services/http.service';
import { Injectable } from '@angular/core';
import { ResponseModel } from '@renderer/model/response.model';
import { RequestModel } from '@renderer/model/request.model';
import { UrlUtils } from '@renderer/utils/url.utils';
import { ConfigModel } from '@renderer/model/config.model';
import { TypeEnum } from '@renderer/enum/type.enum';
import { ClickhouseConfig } from '@renderer/config/clickhouse.config';
import { Factory } from '@renderer/factory';
import { StringUtils } from '@renderer/utils/string.utils';
import { DatabaseModel } from '@renderer/model/database.model';
import { defaults } from 'codemirror';
import { DatabaseEnum } from '@renderer/enum/database.enum';

@Injectable()
export class MetadataService implements BaseService {
  baseConfig: any;

  constructor(private httpService: HttpService) {
    this.baseConfig = Factory.create(ClickhouseConfig);
  }

  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
    return this.httpService.post(UrlUtils.formatUrl(request), sql);
  }

  getDiskUsedAndRatio(request: RequestModel, config: ConfigModel): Promise<ResponseModel> {
    let sql;
    const baseConfig = Factory.create(ClickhouseConfig);
    switch (config.type) {
      case TypeEnum.disk:
        sql = baseConfig.diskUsedRatio;
        break;
      case TypeEnum.server:
        sql = baseConfig.databaseDiskUsedRatio;
        break;
      case TypeEnum.database:
        sql = StringUtils.format(baseConfig.tableDiskUsedRatio, [config.key]);
        break;
      case TypeEnum.table:
      case TypeEnum.column:
        sql = StringUtils.format(baseConfig.columnDiskUsedRatio, [config.database, config.key, 100]);
        break;
    }
    return this.getResponse(request, sql);
  }

  getChild(request: RequestModel, config: ConfigModel): Promise<ResponseModel> {
    let sql;
    switch (config.type) {
      case TypeEnum.server:
        sql = this.baseConfig.databaseItems;
        break;
      case TypeEnum.database:
        sql = StringUtils.format(this.baseConfig.tableItems, [config.key]);
        break;
      case TypeEnum.table:
        sql = StringUtils.format(this.baseConfig.columnItems, [config.database, config.key]);
        break;
    }
    return this.getResponse(request, sql);
  }

  getInfo(request: RequestModel) {
    const sql = this.baseConfig.serverInfo;
    return this.getResponse(request, sql);
  }

  createDatabase(request: RequestModel, database: DatabaseModel): Promise<ResponseModel> {
    let sql;
    switch (database.type) {
      case DatabaseEnum.none:
      default:
        sql = StringUtils.format('CREATE DATABASE {0}', [database.name])
        break;
    }
    return this.getResponse(request, sql);
  }
}
