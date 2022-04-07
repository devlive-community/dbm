import { StateEnum } from '@renderer/enum/state.enum';
import { BaseModel } from '@renderer/model/base.model';

export class QueryHistoryModel extends BaseModel {
  server: string;
  query: string;
  state: StateEnum;
  startTime: number;
  endTime: number;
  elapsedTime: number;
  createdTime: number;
  message: string;
}
