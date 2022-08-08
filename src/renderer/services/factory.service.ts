import { DatabaseEnum } from "@renderer/enum/database.enum";
import { Factory } from "@renderer/factory";
import { MySQLConfig } from "@renderer/config/plugin/mysql.config";
import { PostgresqlConfig } from "@renderer/config/plugin/postgresql.config";
import { DefaultBuilder } from "@renderer/services/builder/default.builder";
import { ClickhouseBuilder } from "@renderer/services/builder/clickhouse.builder";
import { PrestoConfig } from "@renderer/config/plugin/presto.config";
import { ClickhouseConfig } from "@renderer/config/plugin/clickhouse.config";
import { DruidConfig } from "@renderer/config/plugin/druid.config";
import { ElasticsearchConfig } from "@renderer/config/plugin/elasticsearch.config";
import { PostgresqlBuilder } from "@renderer/services/builder/postgresql.builder";

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
      case DatabaseEnum.hologres:
        return Factory.create(PostgresqlConfig);
      case DatabaseEnum.druid:
        return Factory.create(DruidConfig);
      case DatabaseEnum.elasticsearch:
        return Factory.create(ElasticsearchConfig);
      default:
        new Error("Unsupported database type");
        return null;
    }
  }

  public forwardBuilder(type: string) {
    switch (type) {
      case DatabaseEnum.clickhosue:
        return Factory.create(ClickhouseBuilder);
      case DatabaseEnum.postgresql:
        return Factory.create(PostgresqlBuilder);
      default:
        return Factory.create(DefaultBuilder);
    }
  }
}
