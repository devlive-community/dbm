import { DatabaseEnum } from '@renderer/enum/database.enum';
import { PropertyModel } from '@renderer/model/property.model';

export class DatabaseModel {
  name: string;
  description: string;
  type: DatabaseEnum;
  engines: DatabaseModel[];
  property: any;
  properties: PropertyModel[];

  public static builder(name: string, description: string, type: DatabaseEnum, properties: PropertyModel[]): DatabaseModel {
    const database = new DatabaseModel();
    database.name = name;
    database.description = description;
    database.type = type;
    database.properties = properties;
    return database;
  }
}
