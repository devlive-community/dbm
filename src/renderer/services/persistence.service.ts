export abstract class PersistenceService {
  public abstract save(model: any): any;
  public abstract getAll(): any[];
  public abstract clear(): boolean;
  public abstract deleteById(id: number): boolean;
}
