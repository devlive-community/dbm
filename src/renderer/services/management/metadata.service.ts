import { BaseService } from '@renderer/services/base.service';
import { HttpService } from '@renderer/services/http.service';
import { Injectable } from '@angular/core';
import { ResponseModel } from '@renderer/model/response.model';
import { RequestModel } from '@renderer/model/request.model';
import { UrlUtils } from '@renderer/utils/url.utils';
import { TreeModel } from '@renderer/model/tree.model';
import { TypeEnum } from '@renderer/enum/type.enum';
import { ClickhouseConfig } from '@renderer/config/clickhouse.config';
import { Factory } from '@renderer/factory';
import { StringUtils } from '@renderer/utils/string.utils';

@Injectable()
export class MetadataService implements BaseService {
  constructor(private httpService: HttpService) {
  }

  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
    return this.httpService.post(UrlUtils.formatUrl(request), sql);
  }

  getDiskUsedAndRatio(request: RequestModel, config: TreeModel): Promise<ResponseModel> {
    let sql;
    const baseConfig = Factory.create(ClickhouseConfig);
    switch (config.type) {
      case TypeEnum.server:
        sql = baseConfig.diskUsedRatio;
        break;
      case TypeEnum.database:
        sql = baseConfig.databaseDiskUsedRatio;
        break;
    }
    return this.getResponse(request, sql);
  }

  getChild(request: RequestModel, config: TreeModel): Promise<ResponseModel> {
    let sql;
    const baseConfig = Factory.create(ClickhouseConfig);
    console.log(config)
    switch (config.type) {
      case TypeEnum.server:
        sql = baseConfig.databaseItems;
        break;
      case TypeEnum.database:
        sql = StringUtils.format(baseConfig.tableItems, [config.key]);
        break;
      case TypeEnum.table:
        sql = StringUtils.format(baseConfig.columnItems, [config.database, config.key]);;
        break;
    }
    return this.getResponse(request, sql);
  }
}
