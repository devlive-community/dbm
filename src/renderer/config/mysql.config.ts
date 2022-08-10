import { ConfigInterface } from "@renderer/interfaces/config.interface";
import { DatabaseEnum } from "@renderer/enum/database.enum";
import { Injectable } from "@angular/core";
import { Factory } from "@renderer/factory";
import { MySQLConfig } from "@renderer/config/plugin/mysql.config";

@Injectable()
export class MysqlConfig implements ConfigInterface {
  private readonly config: MySQLConfig;

  constructor() {
    this.config = Factory.create(MySQLConfig);
  }

  getName(): DatabaseEnum {
    return DatabaseEnum.mysql;
  }

  getStatement(key: string): string {
    return this.config[key];
  }
}
