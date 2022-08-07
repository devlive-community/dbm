import { ConfigInterface } from "@renderer/interfaces/config.interface";
import { DatabaseEnum } from "@renderer/enum/database.enum";
import { Injectable } from "@angular/core";
import { PostgresqlConfig } from "@renderer/config/plugin/postgresql.config";

@Injectable()
export class PostgreSQLConfig implements ConfigInterface {
  private readonly config: PostgresqlConfig;

  constructor() {
    this.config = new PostgresqlConfig();
  }

  getName(): DatabaseEnum {
    return DatabaseEnum.postgresql;
  }

  getStatement(key: string): string {
    return this.config[key];
  }
}
