import { BasePluginService } from '@renderer/services/plugin/base.plugin.service';
import { RequestModel } from '@renderer/model/request.model';
import { ResponseModel } from '@renderer/model/response.model';
import { HttpService } from '@renderer/services/http.service';
import { Injectable } from '@angular/core';
import { SshService } from '@renderer/services/ssh.service';
import { BasicService } from '@renderer/services/system/basic.service';
import { ForwardService } from '@renderer/services/forward.service';

@Injectable()
export class ClickhousePluginService extends ForwardService implements BasePluginService {
  constructor(httpService: HttpService,
              sshService: SshService,
              basicService: BasicService) {
    super(httpService, sshService, basicService);
  }

  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
    return this.forward(request, sql);
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
  `;
    return this.getResponse(request, sql);
  }
}
