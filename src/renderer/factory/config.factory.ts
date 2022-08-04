import { DatabaseEnum } from "@renderer/enum/database.enum";
import { Inject, Injectable } from "@angular/core";
import { ConfigToken } from "@renderer/token/config.token";
import { ConfigInterface } from "@renderer/interfaces/config.interface";

@Injectable()
export class ConfigFactory {
  constructor(@Inject(ConfigToken) private configs: ConfigInterface[]) {
  }

  createConfig(name: DatabaseEnum) {
    return this.configs.filter(item => item.getName() === name)[0];
  }
}
