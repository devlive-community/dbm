import { HttpService } from '@renderer/services/http.service';
import { SshService } from '@renderer/services/ssh.service';
import { ResponseModel } from '@renderer/model/response.model';
import { UrlUtils } from '@renderer/utils/url.utils';
import { SshModel } from '@renderer/model/ssh.model';
import { RequestModel } from '@renderer/model/request.model';
import { SystemBasicModel } from '@renderer/model/system.model';
import { BasicService } from '@renderer/services/system/basic.service';

export class ForwardService {
  constructor(
    private httpService: HttpService,
    private sshService: SshService,
    private basicService: BasicService
  ) {
  }

  private getConfig(): SystemBasicModel {
    return this.basicService.get() === null ? new SystemBasicModel() : this.basicService.get();
  }

  public forward(request: RequestModel, sql?: string): Promise<ResponseModel> {
    const configure = request.config;
    switch (configure.protocol) {
      case 'HTTP':
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
        return this.sshService.post(sql + '\n FORMAT ' + basicConfig.format, sshConfigure);
      default:
        return Promise.reject(new Error('Unsupported protocol'));
    }
  }
}
