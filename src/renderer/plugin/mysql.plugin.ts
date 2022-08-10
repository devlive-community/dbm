import { PluginInterface } from "@renderer/interfaces/plugin.interface";
import { Injectable } from "@angular/core";
import { DatabaseEnum } from "@renderer/enum/database.enum";
import { ResponseDataModel, ResponseModel } from "@renderer/model/response.model";
import { RequestModel } from "@renderer/model/request.model";
import { SystemBasicModel } from "@renderer/model/system.model";
import { BasicService } from "@renderer/services/system/basic.service";
import { timeout, TimeoutError } from 'promise-timeout';

const mysql = require('mysql');

@Injectable()
export class MysqlPlugin implements PluginInterface {

  constructor(private basicService: BasicService) {
  }

  getName(): DatabaseEnum {
    return DatabaseEnum.mysql;
  }

  private getConfig(): SystemBasicModel {
    return this.basicService.get() === null ? new SystemBasicModel() : this.basicService.get();
  }

  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
    const configure = request.config;
    const start = new Date().getTime();
    const network = this.getConfig().network * 1000;
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
