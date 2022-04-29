import { BaseService } from '@renderer/services/base.service';
import { RequestModel } from '@renderer/model/request.model';
import { ResponseModel } from '@renderer/model/response.model';
import { HttpService } from '@renderer/services/http.service';
import { StringUtils } from '@renderer/utils/string.utils';
import { Injectable } from '@angular/core';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { SshService } from '@renderer/services/ssh.service';
import { BasicService } from '@renderer/services/system/basic.service';
import { ForwardService } from '@renderer/services/forward.service';

@Injectable()
export class TrackService extends ForwardService implements BaseService {
  constructor(private datasourceService: DatasourceService,
              httpService: HttpService,
              sshService: SshService,
              basicService: BasicService) {
    super(httpService, sshService, basicService);
  }

  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
    return this.forward(request, sql);
  }

  async getTrackInfo(aliasServerName: string, trackId: string) {
    const sql = StringUtils.format(`
SELECT
  query_id AS id,
  type AS type,
  event_date AS startTime,
  query_start_time AS queryStartTime,
  query_duration_ms AS "duration(ms)",
  read_rows AS readRows,
  read_bytes AS readBytes,
  written_rows AS writtenRows,
  written_bytes AS writtenBytes,
  result_rows AS resultRows,
  result_bytes AS resultBytes,
  memory_usage AS memoryUsage,
  query AS query,
  exception AS exception,
  stack_trace AS stack,
  user AS user,
  address AS address
FROM
  system.query_log
WHERE
  query_id = '{0}'
ORDER BY
  type DESC
  `, [trackId]);
    const request = new RequestModel();
    request.config = await this.datasourceService.getByAliasAsync(aliasServerName);
    return this.getResponse(request, sql);
  }

  async getTrackTop(aliasServerName: string, top?: number) {
    if (StringUtils.isEmpty(top)) {
      top = 100;
    }
    const sql = StringUtils.format(`
SELECT
  DISTINCT query_id AS value,
  query_start_time AS time
FROM
  system.query_log
ORDER BY
  query_start_time DESC
LIMIT
  {0}
  `, [top]);
    const request = new RequestModel();
    request.config = await this.datasourceService.getByAliasAsync(aliasServerName);
    return this.getResponse(request, sql);
  }
}
