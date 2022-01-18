import { DatabaseEnum } from "@renderer/enum/database.enum";

export class DatabaseModel {
    name: string;
    description: string;
    type: DatabaseEnum = DatabaseEnum.none;
    engines: DatabaseModel[];
    hasProperty: boolean;

    public static builder(name: string, description: string, type: DatabaseEnum, hasProperty: boolean): DatabaseModel {
        const database = new DatabaseModel();
        database.name = name;
        database.description = description;
        database.type = type;
        database.hasProperty = hasProperty;
        return database;
    }
}
