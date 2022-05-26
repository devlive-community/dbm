import {BaseService} from '@renderer/services/base.service';
import {RequestModel} from '@renderer/model/request.model';
import {ResponseModel} from '@renderer/model/response.model';
import {Injectable} from '@angular/core';
import {HttpService} from '@renderer/services/http.service';
import {StringUtils} from '@renderer/utils/string.utils';
import {SshService} from '@renderer/services/ssh.service';
import {BasicService} from '@renderer/services/system/basic.service';
import {ForwardService} from '@renderer/services/forward.service';
import {FactoryService} from "@renderer/services/factory.service";
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
    const sql = StringUtils.format(`
    SELECT
        user,
        client_hostname AS host,
        client_name AS hash,
        query AS query,
        query_start_time AS time,
        query_duration_ms AS elapsed,
        round(memory_usage / 1048576) AS memoryUsage,
        result_rows AS rows,
        result_bytes / 1048576 AS bytes,
        read_rows AS readRows,
        round(read_bytes / 1048576) AS bytesRead,
        written_rows AS writtenRows,
        round(written_bytes / 1048576) AS bytesWritten
    FROM system.query_log
    WHERE type = 2
    AND query_duration_ms >= {0}
    ORDER BY query_duration_ms DESC
    LIMIT 100
      `, [threshold]);
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
