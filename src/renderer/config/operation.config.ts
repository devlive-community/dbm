import { OperationModel } from '@renderer/model/operation.model';
import { TypeEnum } from '@renderer/enum/type.enum';
import { OperationEnum } from '@renderer/enum/operation.enum';

export class OperationConfig {
  getConfig(): OperationModel[] {
    const opertions = new Array();
    const server = new OperationModel();
    server.name = TypeEnum.disk.toString();
    server.type = TypeEnum.disk;
    server.operations = [
      {type: TypeEnum.server, actions: [OperationEnum.info]},
      {type: TypeEnum.database, actions: [OperationEnum.filter]},
      {type: TypeEnum.database, actions: [OperationEnum.create]}
    ];
    opertions.push(server);
    const database = new OperationModel();
    database.name = TypeEnum.database.toString();
    database.type = TypeEnum.database;
    database.operations = [
      {type: TypeEnum.table, actions: [OperationEnum.create]},
      {type: TypeEnum.database, actions: [OperationEnum.delete]},
      {type: TypeEnum.database, actions: [OperationEnum.structure]},
      {type: TypeEnum.database, actions: [OperationEnum.rename]}
    ];
    opertions.push(database);
    const table = new OperationModel();
    table.name = TypeEnum.table.toString();
    table.type = TypeEnum.table;
    table.operations = [
      {type: TypeEnum.table, actions: [OperationEnum.preview]},
      {type: TypeEnum.table, actions: [OperationEnum.delete]},
      {type: TypeEnum.table, actions: [OperationEnum.structure]},
      {type: TypeEnum.table, actions: [OperationEnum.rename]},
      {type: TypeEnum.table, actions: [OperationEnum.truncate]},
      {type: TypeEnum.table, actions: [OperationEnum.clean]},
      {type: TypeEnum.table, actions: [OperationEnum.optimize]},
      {
        type: TypeEnum.table,
        actions: [OperationEnum.ttl],
        children: [
          {type: TypeEnum.table, actions: [OperationEnum.ttl_modify]},
          {type: TypeEnum.table, actions: [OperationEnum.ttl_remove]}
        ]
      }
    ];
    opertions.push(table);
    const column = new OperationModel();
    column.name = TypeEnum.column.toString();
    column.type = TypeEnum.column;
    column.operations = [
      {type: TypeEnum.column, actions: [OperationEnum.preview]},
      {type: TypeEnum.column, actions: [OperationEnum.create]},
      {type: TypeEnum.column, actions: [OperationEnum.delete]},
      {type: TypeEnum.column, actions: [OperationEnum.rename]},
      {type: TypeEnum.column, actions: [OperationEnum.comment]}
    ];
    opertions.push(column);
    return opertions;
  }
}
