import { TableExportEnum } from "@renderer/components/table/basic/table.export.enum";

export class TableExportModel {
  name: string;
  type: TableExportEnum = TableExportEnum.CSV;
  location: string;
}
