import { HttpService } from '@renderer/services/http.service';
import { SshService } from '@renderer/services/ssh.service';
import { ResponseModel } from '@renderer/model/response.model';
import { UrlUtils } from '@renderer/utils/url.utils';
import { SshModel } from '@renderer/model/ssh.model';
import { RequestModel } from '@renderer/model/request.model';
import { SystemBasicModel } from '@renderer/model/system.model';
import { BasicService } from '@renderer/services/system/basic.service';
import { PrestoService } from "@renderer/services/presto.service";
import { DatabaseEnum } from "@renderer/enum/database.enum";
import { FactoryService } from "@renderer/services/factory.service";
import { MySQLService } from "@renderer/services/plugin/mysql.service";
import { PostgresqlService } from "@renderer/services/plugin/postgresql.service";
import { PluginFactory } from "@renderer/factory/plugin.factory";
import { ConfigFactory } from "@renderer/factory/config.factory";

export class ForwardService {
  constructor(
    protected basicService: BasicService,
    protected factoryService: FactoryService,
    protected httpService: HttpService,
    protected sshService: SshService,
    protected prestoService?: PrestoService,
    protected mysqlService?: MySQLService,
    protected postgresqlService?: PostgresqlService,
    protected pluginFactory?: PluginFactory,
    protected configFactory?: ConfigFactory
  ) {
  }

  private getConfig(): SystemBasicModel {
    return this.basicService.get() === null ? new SystemBasicModel() : this.basicService.get();
  }

  public forward(request: RequestModel, sql?: string): Promise<ResponseModel> {
    const configure = request.config;
    switch (configure.protocol) {
      case 'HTTP':
        let response;
        switch (configure.type) {
          case DatabaseEnum.clickhosue:
            response = this.httpService.post(UrlUtils.formatUrl(request), sql);
            break
          case DatabaseEnum.trino:
          case DatabaseEnum.presto:
            response = this.prestoService.execute(configure, sql);
            break
          case DatabaseEnum.mysql:
            response = this.mysqlService.execute(configure, sql);
            break
          case DatabaseEnum.postgresql:
            response = this.postgresqlService.execute(configure, sql);
            break
          case DatabaseEnum.druid:
            response = this.httpService.post(UrlUtils.formatUrl(request), sql, true);
            break
          case DatabaseEnum.elasticsearch:
            response = this.pluginFactory.createService(configure.type).getResponse(request, sql);
            break;
        }
        return response;
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
