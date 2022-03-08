import { DatabaseEnum } from '@renderer/enum/database.enum';
import { PropertyEnum } from '@renderer/enum/property.enum';
import { PropertyModel } from '@renderer/model/property.model';

export class DatabaseModel {
  name: string;
  targetName: string; // input value
  description: string;
  type: DatabaseEnum;
  engines: DatabaseModel[];
  property: any;
  database: string;
  table: string;
  icon: string;
  experimental: boolean;
  validate: boolean; // Check whether dependent components pass the verification
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
  /**
   * Optional parameter. The user can customize the processing based on whether the user enters a value
   */
  optionalProperties: PropertyModel[];

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
