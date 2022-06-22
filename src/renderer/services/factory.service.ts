import { DatabaseEnum } from "@renderer/enum/database.enum";
import { Factory } from "@renderer/factory";
import { ClickhouseConfig } from "@renderer/config/clickhouse.config";
import { PrestoConfig } from "@renderer/config/presto.config";
import { MySQLConfig } from "@renderer/config/plugin/mysql.config";
import { PostgresqlConfig } from "@renderer/config/plugin/postgresql.config";

export class FactoryService {
  public forward(type: string) {
    switch (type) {
      case DatabaseEnum.clickhosue:
        return Factory.create(ClickhouseConfig);
      case DatabaseEnum.trino:
      case DatabaseEnum.presto:
        return Factory.create(PrestoConfig);
      case DatabaseEnum.mysql:
        return Factory.create(MySQLConfig);
      case DatabaseEnum.postgresql:
        return Factory.create(PostgresqlConfig);
      default:
        new Error("Unsupported database type");
        return null;
    }
  }
}
