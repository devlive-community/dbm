import { BasePluginService } from '@renderer/services/plugin/base.plugin.service';
import { RequestModel } from '@renderer/model/request.model';
import { ResponseModel } from '@renderer/model/response.model';
import { HttpService } from '@renderer/services/http.utils';
import { UrlUtils } from '@renderer/utils/url.utils';

export class ClickhousePluginService implements BasePluginService {
  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
    return HttpService.post(UrlUtils.formatUrl(request), sql);
  }

  getQueryCount(request: RequestModel): Promise<ResponseModel> {
    const sql = `
SELECT
  cast(COUNT(DISTINCT query_id) AS INT) AS value,
  event_date AS categories
FROM
  system.query_log
GROUP BY
  event_date
ORDER BY
  event_date DESC
LIMIT 100
FORMAT JSON
  `;
    return this.getResponse(request, sql);
  }
}
