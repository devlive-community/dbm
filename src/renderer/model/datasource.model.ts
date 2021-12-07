export class DatasourceModel {
  id: number;
  name: string;
  alias: string;
  host: string;
  port: number;
  username: string;
  password: string;
  status = false;
  message: string;
  delivery = false;
  protocol = 'http';
}
