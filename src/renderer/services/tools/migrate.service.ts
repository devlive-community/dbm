import { Injectable } from '@angular/core';
import { RequestModel } from '@renderer/model/request.model';
import { ResponseModel } from '@renderer/model/response.model';
import { BaseService } from '@renderer/services/base.service';
import { HttpService } from '@renderer/services/http.service';
import { UrlUtils } from '@renderer/utils/url.utils';
import { DatasourceService } from '../management/datasource.service';
import { TableService } from '../management/table.service';

@Injectable()
export class MigrateService implements BaseService {
    constructor(private httpService: HttpService,
        private tableService: TableService,
        private datasourceService: DatasourceService) {
    }

    getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
        return this.httpService.post(UrlUtils.formatUrl(request), sql);
    }

    migrate(source, target): Promise<ResponseModel> {
        return null;
    }
}