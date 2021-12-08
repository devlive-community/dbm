import { BaseModel } from '@renderer/model/base.model';

export abstract class PersistenceService {
  public abstract save(model: BaseModel): any;
  public abstract getAll(): BaseModel[];
}
