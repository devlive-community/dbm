import { Injectable } from '@angular/core';
import { RequestModel } from '@renderer/model/request.model';
import { ResponseModel } from '@renderer/model/response.model';
import { BaseService } from '@renderer/services/base.service';
import { HttpService } from '@renderer/services/http.service';
import { UrlUtils } from '@renderer/utils/url.utils';

@Injectable()
export class DatabaseService implements BaseService {
    constructor(private httpService: HttpService) {
    }

    getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
        return this.httpService.post(UrlUtils.formatUrl(request), sql);
    }

    getAll(request: RequestModel): Promise<ResponseModel> {
        const sql = 'SHOW DATABASES';
        return this.getResponse(request, sql);
    }
}