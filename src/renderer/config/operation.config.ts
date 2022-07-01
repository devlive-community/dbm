import { OperationModel } from '@renderer/model/operation.model';
import { TypeEnum } from '@renderer/enum/type.enum';
import { OperationEnum } from '@renderer/enum/operation.enum';
import { DatabaseEnum } from "@renderer/enum/database.enum";

export class OperationConfig {
  getConfig(): OperationModel[] {
    const opertions = new Array();
    const server = new OperationModel();
    server.name = TypeEnum.disk.toString();
    server.type = TypeEnum.disk;
    server.operations = [
      {
        type: TypeEnum.server,
        actions: [OperationEnum.info],
        supportedSource: [DatabaseEnum.clickhosue, DatabaseEnum.trino, DatabaseEnum.presto, DatabaseEnum.mysql]
      },
      {
        type: TypeEnum.database,
        actions: [OperationEnum.filter],
        supportedSource: [DatabaseEnum.clickhosue, DatabaseEnum.mysql]
      },
      {
        type: TypeEnum.database,
        actions: [OperationEnum.create],
        supportedSource: [DatabaseEnum.clickhosue, DatabaseEnum.trino, DatabaseEnum.presto, DatabaseEnum.mysql]
      }
    ];
    opertions.push(server);
    const database = new OperationModel();
    database.name = TypeEnum.database.toString();
    database.type = TypeEnum.database;
    database.operations = [
      {
        type: TypeEnum.table,
        actions: [OperationEnum.create],
        supportedSource: [DatabaseEnum.clickhosue, DatabaseEnum.mysql]
      },
      {
        type: TypeEnum.table,
        actions: [OperationEnum.filter],
        supportedSource: [DatabaseEnum.clickhosue, DatabaseEnum.mysql]
      },
      {
        type: TypeEnum.database,
        actions: [OperationEnum.delete],
        supportedSource: [DatabaseEnum.clickhosue, DatabaseEnum.mysql]
      },
      {
        type: TypeEnum.database,
        actions: [OperationEnum.structure],
        supportedSource: [DatabaseEnum.clickhosue, DatabaseEnum.mysql]
      },
      {type: TypeEnum.database, actions: [OperationEnum.rename], supportedSource: [DatabaseEnum.clickhosue]}
    ];
    opertions.push(database);
    const table = new OperationModel();
    table.name = TypeEnum.table.toString();
    table.type = TypeEnum.table;
    table.operations = [
      {
        type: TypeEnum.table,
        actions: [OperationEnum.preview],
        supportedSource: [DatabaseEnum.clickhosue, DatabaseEnum.mysql]
      },
      {
        type: TypeEnum.table,
        actions: [OperationEnum.delete],
        supportedSource: [DatabaseEnum.clickhosue, DatabaseEnum.mysql]
      },
      {
        type: TypeEnum.table,
        actions: [OperationEnum.structure],
        supportedSource: [DatabaseEnum.clickhosue, DatabaseEnum.mysql]
      },
      {
        type: TypeEnum.table,
        actions: [OperationEnum.rename],
        supportedSource: [DatabaseEnum.clickhosue, DatabaseEnum.mysql]
      },
      {
        type: TypeEnum.table,
        actions: [OperationEnum.truncate],
        supportedSource: [DatabaseEnum.clickhosue, DatabaseEnum.mysql]
      },
      {type: TypeEnum.table, actions: [OperationEnum.clean], supportedSource: [DatabaseEnum.clickhosue]},
      {type: TypeEnum.table, actions: [OperationEnum.optimize], supportedSource: [DatabaseEnum.clickhosue]},
      {
        type: TypeEnum.table,
        actions: [OperationEnum.ttl],
        supportedSource: [DatabaseEnum.clickhosue],
        children: [
          {type: TypeEnum.table, actions: [OperationEnum.ttl_modify], supportedSource: [DatabaseEnum.clickhosue]},
          {type: TypeEnum.table, actions: [OperationEnum.ttl_remove], supportedSource: [DatabaseEnum.clickhosue]}
        ]
      }
    ];
    opertions.push(table);
    const column = new OperationModel();
    column.name = TypeEnum.column.toString();
    column.type = TypeEnum.column;
    column.operations = [
      {
        type: TypeEnum.column,
        actions: [OperationEnum.preview],
        supportedSource: [DatabaseEnum.clickhosue, DatabaseEnum.mysql]
      },
      {
        type: TypeEnum.column,
        actions: [OperationEnum.create],
        supportedSource: [DatabaseEnum.clickhosue, DatabaseEnum.mysql]
      },
      {
        type: TypeEnum.column,
        actions: [OperationEnum.delete],
        supportedSource: [DatabaseEnum.clickhosue, DatabaseEnum.mysql]
      },
      {type: TypeEnum.column, actions: [OperationEnum.rename], supportedSource: [DatabaseEnum.clickhosue]},
      {type: TypeEnum.column, actions: [OperationEnum.comment], supportedSource: [DatabaseEnum.clickhosue]}
    ];
    opertions.push(column);
    return opertions;
  }
}
