export abstract class PersistenceService {
  public abstract save(model: any): any;
  public abstract getAll(): any[];
}
