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
  table: string;
  icon: string;
  experimental: boolean;
  /**
   * Customize configuration parameters
   * You are advised to use the key specified in the internationalization file to customize configuration parameters and field description
   */
  properties: PropertyModel[];
  /**
   * key: This is converted to an external key --> value form, such as Engine Kafka kafka_broker_list = XXX
   * name: Convert to internal key --> value form, for example Engine HDFS(uri= XXX)
   */
  propertyType: PropertyEnum;

  public static builder(name: string,
                        description: string,
                        type: DatabaseEnum,
                        properties: PropertyModel[],
                        experimental?: boolean,
                        propertyType?: PropertyEnum,
                        icon?: string): DatabaseModel {
    const database = new DatabaseModel();
    database.name = name;
    database.description = description;
    database.type = type;
    database.properties = properties;
    database.experimental = experimental;
    database.propertyType = propertyType;
    database.icon = icon;
    return database;
  }
}
