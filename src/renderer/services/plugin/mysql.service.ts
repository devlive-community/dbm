import { Injectable } from "@angular/core";
import { SystemBasicModel } from "@renderer/model/system.model";
import { BasicService } from "@renderer/services/system/basic.service";
import { DatasourceModel } from "@renderer/model/datasource.model";
import { ResponseDataModel, ResponseModel } from "@renderer/model/response.model";
import { timeout, TimeoutError } from 'promise-timeout';

@Injectable()
export class MySQLService {

  constructor(private basicService: BasicService) {
  }

  private getConfig(): SystemBasicModel {
    return this.basicService.get() === null ? new SystemBasicModel() : this.basicService.get();
  }

  execute(configure: DatasourceModel, sql: string): Promise<any> {
    const start = new Date().getTime();
    const network = this.getConfig().network * 1000;
    const mysql = require('mysql');
    const connection = mysql.createConnection({
      host: configure.host,
      port: configure.port,
      user: configure.username,
      password: configure.password,
      database: configure.database
    });
    const response = new ResponseModel();
    const responseData = new ResponseDataModel();
    const somePromise = new Promise((resolve) => {
      connection.connect();
      connection.query(sql, function (error, results, fields) {
        if (error) {
          response.status = false;
          response.message = error?.message;
          resolve(response);
        } else {
          responseData.headers = fields;
          responseData.columns = results;
          const end = new Date().getTime();
          const statistics = {
            elapsed: end - start
          };
          responseData.statistics = statistics;
          responseData.rows = results.length;
          response.status = true;
          response.data = responseData;
          resolve(response);
        }
        connection.end();
        console.log('Close connection');
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
