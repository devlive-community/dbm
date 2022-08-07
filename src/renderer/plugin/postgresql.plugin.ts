import { PluginInterface } from "@renderer/interfaces/plugin.interface";
import { DatabaseEnum } from "@renderer/enum/database.enum";
import { Injectable } from "@angular/core";
import { BasicService } from "@renderer/services/system/basic.service";
import { SystemBasicModel } from "@renderer/model/system.model";
import { RequestModel } from "@renderer/model/request.model";
import { ResponseDataModel, ResponseModel } from "@renderer/model/response.model";
import { StringUtils } from "@renderer/utils/string.utils";
import { timeout, TimeoutError } from 'promise-timeout';

const {Client} = require('pg');

@Injectable()
export class PostgreSQLPlugin implements PluginInterface {
  constructor(private basicService: BasicService) {
  }

  private getConfig(): SystemBasicModel {
    return this.basicService.get() === null ? new SystemBasicModel() : this.basicService.get();
  }

  getName(): DatabaseEnum {
    return DatabaseEnum.postgresql;
  }

  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
    const configure = request.config;
    const start = new Date().getTime();
    const network = this.getConfig().network * 1000;
    const hasAuthentication = (StringUtils.isNotEmpty(configure.username) && StringUtils.isNotEmpty(configure.password));
    let connection;
    if (hasAuthentication) {
      connection = new Client({
        host: configure.host,
        port: configure.port,
        user: configure.username,
        password: configure.password,
        database: configure.database
      });
    } else {
      connection = new Client({
        host: configure.host,
        port: configure.port,
        database: configure.database
      });
    }
    const response = new ResponseModel();
    const responseData = new ResponseDataModel();
    const somePromise = new Promise((resolve) => {
      connection.connect().catch(error => {
        response.status = false;
        response.message = error?.message;
        resolve(response);
      })
      connection.query(sql, function (error, results) {
        if (error) {
          response.status = false;
          response.message = error?.message;
          resolve(response);
        } else {
          responseData.headers = results?.fields;
          responseData.columns = results?.rows;
          const end = new Date().getTime();
          const statistics = {
            elapsed: end - start
          };
          responseData.statistics = statistics;
          responseData.rows = results?.rowCount;
          response.status = true;
          response.data = responseData;
          resolve(response);
        }
        connection.end();
        console.log('Connection ', configure.host, ' is closed');
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
