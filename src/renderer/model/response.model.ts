export class ResponseModel {
  status: boolean;
  message: string;
  data: ResponseDataModel;
}

export class ResponseDataModel {
  columns: any[] = [];
  headers: any[] = [];
  rows: number;
  statistics: any;
}
