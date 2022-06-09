import { Injectable } from "@angular/core";
import { SystemBasicModel } from "@renderer/model/system.model";
import { BasicService } from "@renderer/services/system/basic.service";
import { DatasourceModel } from "@renderer/model/datasource.model";
import { ResponseDataModel, ResponseModel } from "@renderer/model/response.model";
import { StringUtils } from "@renderer/utils/string.utils";
import { timeout, TimeoutError } from 'promise-timeout';

@Injectable()
export class PrestoService {

  constructor(private basicService: BasicService) {
  }

  private getConfig(): SystemBasicModel {
    return this.basicService.get() === null ? new SystemBasicModel() : this.basicService.get();
  }

  execute(configure: DatasourceModel, sql: string): Promise<any> {
    const {Client} = require('presto-stream-client');
    const network = this.getConfig().network * 1000;
    let client;
    const hasAuthentication = (StringUtils.isNotEmpty(configure.username) && StringUtils.isNotEmpty(configure.password));
    if (hasAuthentication) {
      client = new Client({
        host: configure.host,
        port: configure.port,
        user: configure.username,
        password: configure.password,
        pollInterval: network,
        source: 'dbm-client'
      });
    } else {
      client = new Client({host: configure.host, port: configure.port, pollInterval: network, source: 'dbm-client'});
    }
    const response = new ResponseModel();
    const responseData = new ResponseDataModel();
    const somePromise = new Promise((resolve) => {
      client.execute({
        query: sql,
        catalog: StringUtils.isNotEmpty(configure.catalog) ? configure.catalog : 'hive',
        schema: StringUtils.isNotEmpty(configure.database) ? configure.database : 'default',
        objectMode: true
      }).then((statement) => {
        statement.on('columns', (columns) => {
          responseData.headers = columns;
        });
        statement.on('data', (rows) => {
          responseData.columns.push(rows);
        });
        statement.on('end', () => {
          response.status = true;
          response.data = responseData;
          resolve(response);
        });
        statement.on('error', (err) => {
          response.status = false;
          response.message = err?.message;
          resolve(response);
        });
      }, (err) => {
        response.status = false;
        response.message = err;
        resolve(response);
      });
    });
    return timeout(somePromise, network)
      .then((thing) => {
        return thing;
      })
      .catch((err) => {
        response.status = false;
        if (err instanceof TimeoutError) {
          response.message = `Promise timed out after ${this.getConfig().network} ms`;
        } else {
          response.message = err;
        }
        return response;
      });
  }
}
