export class ResponseModel {
  status: boolean;
  message: string;
  data: ResponseDataModel;
}

export class ResponseDataModel {
  columns: [];
  headers: [];
  rows: number;
  statistics: any;
}
