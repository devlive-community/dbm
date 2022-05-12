import { DatasourceModel } from '@renderer/model/datasource.model';
import { KvModel } from '@renderer/model/kv.model';

export class RequestModel {
  config: DatasourceModel;
  server: string;
  params: Array<KvModel>;
}
