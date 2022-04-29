import { ForwardService } from '@renderer/services/forward.service';

export abstract class PersistenceService extends ForwardService {
  public abstract save(model: any): any;

  public abstract getAll(): any;

  public abstract clear(): boolean;

  public abstract deleteById(id: number): boolean;
}
