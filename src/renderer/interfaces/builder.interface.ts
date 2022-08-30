import { DatabaseEnum } from "@renderer/enum/database.enum";
import { DesignerColumn } from "@renderer/app/views/object_designer/model/designer.column";

export interface BuilderInterface {
  getName(): DatabaseEnum;

  builderCreateDatabase(database: string): string;

  builderRenameDatabase(source: string, target: string): string;

  builderDropDatabase(database: string): string;

  builderCreateTable(database: string, table: string, engine: string, columns: DesignerColumn[]): string;

  builderRenameTable(database: string, source: string, target: string): string;

  builderDropTable(database: string, table: string): string;
}
