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
import { DatabaseEnum } from '@renderer/enum/database.enum';
import { PropertyModel } from '@renderer/model/property.model';

@Injectable()
export class MetadataService implements BaseService {
  baseConfig: any;
  WORD = 'ENGINE';

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
    const prefix = StringUtils.format('CREATE DATABASE {0}', [database.name]);
    let suffix;
    switch (database.type) {
      case DatabaseEnum.none:
        suffix = '';
        break;
      case DatabaseEnum.atomic:
        suffix = this.builderDatabaseAtomic(database);
        break;
      case DatabaseEnum.lazy:
        suffix = this.builderDatabaseLazy(database);
        break;
      case DatabaseEnum.mysql:
        suffix = this.builderDatabaseMySQL(database);
        break;
    }
    return this.getResponse(request, StringUtils.format('{0} {1}', [prefix, suffix]));
  }

  /**
   * Build the database DDL for atomic
   * <p>
   *   example: CREATE DATABASE xxx ENGINE Atomic
   * </p>
   *
   * @param value database configure
   * @returns suffix ddl
   */
  private builderDatabaseAtomic(value): string {
    return StringUtils.format('{0} = {1}', [this.WORD, value.type]);
  }

  /**
   * Build the database DDL for lazy
   * <p>
   *   example: CREATE DATABASE xxx ENGINE Lazy(xxx)
   * </p>
   *
   * @param value database configure
   * @returns suffix ddl
   */
  private builderDatabaseLazy(value): string {
    return StringUtils.format('{0} = {1}({2})', [this.WORD, value.type, value.property.timeSeconds]);
  }

  /**
   * Build the database DDL for mysql and MaterializedMySQL
   * <p>
   *   example: CREATE DATABASE xxx ENGINE MaterializedMySQL('host:port', ['database' | database], 'user', 'password')
   * </p>
   *
   * @param value database configure
   * @returns suffix ddl
   */
  private builderDatabaseMySQL(value): string {
    const map = this.flatProperty(value.property.properties);
    let response;
    if (StringUtils.isEmpty(map.get('database'))) {
      response = StringUtils.format('{0} = {1}({2}, {3}, {4})', [this.WORD, value.type,
        StringUtils.format('{0}:{1}', [map.get('host'), map.get('port')]),
        map.get('username'),
        map.get('password')]);
    } else {
      response = StringUtils.format(`{0} = {1}('{2}', '{3}', '{4}', '{5}')`, [this.WORD, value.type,
        StringUtils.format('{0}:{1}', [map.get('host'), map.get('port')]),
        map.get('database'),
        map.get('username'),
        map.get('password')]);
    }
    return response;
  }

  private flatProperty(properties: PropertyModel[]): Map<string, string> {
    const map = new Map<string, string>();
    properties.forEach(p => map.set(p.name, p.value));
    return map;
  }
}
