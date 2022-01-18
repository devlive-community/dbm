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
      {type: TypeEnum.database, actions: [OperationEnum.create]}
    ];
    opertions.push(server);
    return opertions;
  }
}
