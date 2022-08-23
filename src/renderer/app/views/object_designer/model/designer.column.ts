export class DesignerColumnModel {
  id: string;
  name: string;
  type: string;
  length: number = 0;
  comment: string;
  isNull: boolean = false;
  isPrimaryKey: boolean = false;
}
