import { BaseService } from '@renderer/services/base.service';
import { RequestModel } from '@renderer/model/request.model';
import { ResponseModel } from '@renderer/model/response.model';
import { Injectable } from '@angular/core';
import { HttpService } from '@renderer/services/http.service';
import { UrlUtils } from '@renderer/utils/url.utils';

@Injectable()
export class MonitorService implements BaseService {
  constructor(private httpService: HttpService) {
  }

  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
    return this.httpService.post(UrlUtils.formatUrl(request), sql);
  }

  getProcesses(request: RequestModel): Promise<ResponseModel> {
    const sql = `
SELECT
  query_id AS id,
  now() AS time,
  query AS query,
  toUInt64(toUInt64(read_rows) + toUInt64(written_rows)) AS rows,
  round(elapsed, 1) AS elapsed,
  formatReadableSize(toUInt64(read_bytes) + toUInt64(written_bytes)) AS bytes,
  formatReadableSize(memory_usage) AS memoryUsage,
  formatReadableSize(read_bytes) AS bytesRead,
  formatReadableSize(written_bytes) AS bytesWritten,
  cityHash64(query) AS hash,
  hostName() AS host
FROM
  system.processes
WHERE
  round(elapsed, 1) > 0
  `;
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
    const sql = `
SELECT
  metric AS categories,
  toUInt32(SUM(value)) AS value
FROM
  system.metrics
WHERE
  metric LIKE '%Connection'
GROUP BY
  metric
ORDER BY
  metric DESC
  `;
    return this.getResponse(request, sql);
  }
}
