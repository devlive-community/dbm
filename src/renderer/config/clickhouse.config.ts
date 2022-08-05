import { ConfigInterface } from "@renderer/interfaces/config.interface";
import { Injectable } from "@angular/core";
import { Factory } from "@renderer/factory";
import { DatabaseEnum } from "@renderer/enum/database.enum";
import { ClickhouseConfig } from "@renderer/config/plugin/clickhouse.config";

@Injectable()
export class ClickHouseConfig implements ConfigInterface {
  private readonly config: ClickhouseConfig;

  constructor() {
    this.config = Factory.create(ClickhouseConfig);
  }

  getName(): DatabaseEnum {
    return DatabaseEnum.clickhosue;
  }

  getStatement(key: string): string {
    return this.config[key];
  }
}
