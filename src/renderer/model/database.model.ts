import { DatabaseEnum } from '@renderer/enum/database.enum';
import { PropertyEnum } from '@renderer/enum/property.enum';
import { PropertyModel } from '@renderer/model/property.model';

export class DatabaseModel {
  name: string;
  description: string;
  type: DatabaseEnum;
  engines: DatabaseModel[];
  property: any;
  database: string;
  experimental: boolean;
  properties: PropertyModel[];
  propertyType: PropertyEnum;

  public static builder(name: string,
                        description: string,
                        type: DatabaseEnum,
                        properties: PropertyModel[],
                        experimental?: boolean,
                        propertyType?: PropertyEnum): DatabaseModel {
    const database = new DatabaseModel();
    database.name = name;
    database.description = description;
    database.type = type;
    database.properties = properties;
    database.experimental = experimental;
    database.propertyType = propertyType;
    return database;
  }
}
