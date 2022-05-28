import { BaseService } from '@renderer/services/base.service';
import { RequestModel } from '@renderer/model/request.model';
import { ResponseModel } from '@renderer/model/response.model';
import { Injectable } from '@angular/core';
import { HttpService } from '@renderer/services/http.service';
import { StringUtils } from '@renderer/utils/string.utils';
import { SshService } from '@renderer/services/ssh.service';
import { BasicService } from '@renderer/services/system/basic.service';
import { ForwardService } from '@renderer/services/forward.service';
import { FactoryService } from "@renderer/services/factory.service";
import { PrestoService } from "@renderer/services/presto.service";

@Injectable()
export class MonitorService extends ForwardService implements BaseService {
  constructor(httpService: HttpService,
              sshService: SshService,
              basicService: BasicService,
              factoryService: FactoryService,
              prestoService: PrestoService) {
    super(basicService, factoryService, httpService, sshService, prestoService);
  }

  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
    return this.forward(request, sql);
  }

  getProcesses(request: RequestModel): Promise<ResponseModel> {
    const sql = this.factoryService.forward(request.config.type).processesFetchAll;
    return this.getResponse(request, sql);
  }

  getSlowQuery(request: RequestModel, threshold: number): Promise<ResponseModel> {
    const sql = StringUtils.format(this.factoryService.forward(request.config.type).slowQueryFetchAll, [threshold]);
    return this.getResponse(request, sql);
  }

  getMutations(request: RequestModel): Promise<ResponseModel> {
    const sql = `
SELECT
  database,
  table,
  mutation_id AS id,
  command AS query,
  create_time AS createTime,
  now() - create_time AS "elapsedTime(ms)"
FROM
  system.mutations
WHERE is_done = 0
  `;
    return this.getResponse(request, sql);
  }

  getConnections(request: RequestModel): Promise<ResponseModel> {
    const sql = this.factoryService.forward(request.config.type).connectionFetchAll;
    return this.getResponse(request, sql);
  }
}
