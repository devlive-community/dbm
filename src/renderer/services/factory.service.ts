import {DatabaseEnum} from "@renderer/enum/database.enum";
import {Factory} from "@renderer/factory";
import {ClickhouseConfig} from "@renderer/config/clickhouse.config";
import {PrestoConfig} from "@renderer/config/presto.config";

export class FactoryService {
  public forward(type: string) {
    switch (type) {
      case DatabaseEnum.clickhosue:
        return Factory.create(ClickhouseConfig);
      case DatabaseEnum.trino:
      case DatabaseEnum.presto:
        return Factory.create(PrestoConfig);
      default:
        new Error("Unsupported database type");
        return null;
    }
  }
}
