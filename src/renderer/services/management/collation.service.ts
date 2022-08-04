import { BaseService } from "@renderer/services/base.service";
import { ResponseModel } from "@renderer/model/response.model";
import { PluginFactory } from "@renderer/factory/plugin.factory";
import { Injectable } from "@angular/core";
import { RequestModel } from "@renderer/model/request.model";
import { ConfigFactory } from "@renderer/factory/config.factory";

@Injectable()
export class CollationService implements BaseService {

  constructor(private pluginFactory: PluginFactory,
              private configFactory: ConfigFactory) {
  }

  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
    return this.pluginFactory.createService(request.config.type).getResponse(request, sql);
  }

  getCharacterAndCollation(request: RequestModel): Promise<ResponseModel> {
    const source = this.configFactory.createConfig(request.config.type).getStatement('getCharacterAndCollation');
    return this.getResponse(request, source);
  }
}
