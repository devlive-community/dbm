import { DatabaseEnum } from '@renderer/enum/database.enum';

export class DatabaseModel {
  name: string;
  description: string;
  type: DatabaseEnum = DatabaseEnum.none;
  engines: DatabaseModel[];
  property: any;
  propertys: DatabasePropertyModel[];

  public static builder(name: string, description: string, type: DatabaseEnum, propertys: DatabasePropertyModel[]): DatabaseModel {
    const database = new DatabaseModel();
    database.name = name;
    database.description = description;
    database.type = type;
    database.propertys = propertys;
    return database;
  }
}

export class DatabasePropertyModel {
}
