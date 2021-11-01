export default class DataSource {
  id = 1;
  name = null;
  alias = 'localhost';
  host = 'localhost';
  port = 8123;
  username = 'default';
  password = '';
  status = false;
  message = 'Please check whether the version of Clickhouse supports it!';
  delivery = false;
  protocol = 'http';
  version = null;
}
