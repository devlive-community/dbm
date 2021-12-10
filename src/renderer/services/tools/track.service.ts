import { BaseService } from '@renderer/services/base.service';
import { RequestModel } from '@renderer/model/request.model';
import { ResponseModel } from '@renderer/model/response.model';
import { HttpUtils } from '@renderer/utils/http.utils';
import { UrlUtils } from '@renderer/utils/url.utils';
import { StringUtils } from '@renderer/utils/string.utils';
import { Injectable } from '@angular/core';
import { DatasourceService } from '@renderer/services/management/datasource.service';

@Injectable()
export class TrackService implements BaseService {
  constructor(private datasourceService: DatasourceService) {
  }

  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
    return HttpUtils.post(UrlUtils.formatUrl(request), sql);
  }

  getTrackInfo(aliasServerName: string, trackId: string) {
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
  query_duration_ms DESC
  `, [trackId]);
    const request = new RequestModel();
    request.config = this.datasourceService.getAll(aliasServerName)?.data?.columns[0];
    return this.getResponse(request, sql);
  }

  getTrackTop(aliasServerName: string, top?: number) {
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
    request.config = this.datasourceService.getAll(aliasServerName)?.data?.columns[0];
    return this.getResponse(request, sql);
  }
}
