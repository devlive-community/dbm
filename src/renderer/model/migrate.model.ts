import { StateEnum } from "@renderer/enum/state.enum";

export class MigrateModel {
  id: string;
  steps: Array<MigrateStepModel>;
}

export class MigrateStepModel {
  state: StateEnum;
  message: string;
  order: number;
}
