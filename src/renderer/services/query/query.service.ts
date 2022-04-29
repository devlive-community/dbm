import { BaseService } from '@renderer/services/base.service';
import { RequestModel } from '@renderer/model/request.model';
import { ResponseModel } from '@renderer/model/response.model';
import { HttpService } from '@renderer/services/http.service';
import { Injectable } from '@angular/core';
import { StringUtils } from '@renderer/utils/string.utils';
import { ForwardService } from '@renderer/services/forward.service';
import { SshService } from '@renderer/services/ssh.service';
import { BasicService } from '@renderer/services/system/basic.service';

const {Parser} = require('node-sql-parser');

@Injectable()
export class QueryService extends ForwardService implements BaseService {
  constructor(httpService: HttpService,
              sshService: SshService,
              basicService: BasicService) {
    super(httpService, sshService, basicService);
  }

  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
    const limit = StringUtils.isNotEmpty(request.config?.maxTotal) ? request.config?.maxTotal : 0;
    if (limit !== 0) {
      try {
        const parser = new Parser();
        const ast = parser.astify(sql);
        if (ast.limit === null) {
          sql += '\nLIMIT ' + limit;
        }
      } catch (err) {
        console.log(err);
        // The SQL tree fails to be parsed and no action is taken
      }
    }
    return this.forward(request, sql);
  }
}
