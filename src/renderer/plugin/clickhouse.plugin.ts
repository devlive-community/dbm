import { Injectable } from "@angular/core";
import { DatabaseEnum } from "@renderer/enum/database.enum";
import { PluginInterface } from "@renderer/interfaces/plugin.interface";
import { RequestModel } from "@renderer/model/request.model";
import { ResponseModel } from "@renderer/model/response.model";
import { SshModel } from "@renderer/model/ssh.model";
import { SystemBasicModel } from "@renderer/model/system.model";
import { HttpService } from "@renderer/services/http.service";
import { SshService } from "@renderer/services/ssh.service";
import { BasicService } from "@renderer/services/system/basic.service";
import { UrlUtils } from "@renderer/utils/url.utils";

@Injectable()
export class ClickHousePlugin implements PluginInterface {

  constructor(private httpService: HttpService,
              private sshService: SshService,
              private basicService: BasicService) {
  }

  getName(): DatabaseEnum {
    return DatabaseEnum.clickhosue;
  }

  private getConfig(): SystemBasicModel {
    return this.basicService.get() === null ? new SystemBasicModel() : this.basicService.get();
  }

  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
    const configure = request.config;
    switch (configure.protocol) {
      case 'HTTP':
      case 'HTTPS':
        return this.httpService.post(UrlUtils.formatUrl(request), sql);
      case 'SSH':
        const basicConfig = this.getConfig();
        const network = basicConfig.network * 1000;
        const sshConfigure = new SshModel();
        sshConfigure.sshHost = configure.sshHost;
        sshConfigure.sshPort = configure.sshPort;
        sshConfigure.sshUsername = configure.sshUsername;
        sshConfigure.sshPassword = configure.sshPassword;
        sshConfigure.timeout = network;
        sshConfigure.localHost = configure.host;
        sshConfigure.localPort = configure.port;
        sshConfigure.localUsername = configure.username;
        sshConfigure.localPassword = configure.password;
        sshConfigure.database = configure.database;
        return this.sshService.post(sql + '\n FORMAT ' + basicConfig.format, sshConfigure);
      default:
        return Promise.reject(new Error('Unsupported protocol'));
    }
  }
}
