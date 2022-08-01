import { PluginInterface } from "@renderer/interfaces/plugin.interface";
import { Injectable } from "@angular/core";
import { DatabaseEnum } from "@renderer/enum/database.enum";
import { HttpService } from "@renderer/services/http.service";
import { SshService } from "@renderer/services/ssh.service";
import { BasicService } from "@renderer/services/system/basic.service";
import { ResponseDataModel, ResponseModel } from "@renderer/model/response.model";
import { RequestModel } from "@renderer/model/request.model";
import { SystemBasicModel } from "@renderer/model/system.model";
import { timeout, TimeoutError } from 'promise-timeout';

const http = require('http');

@Injectable()
export class ElasticsearchPlugin implements PluginInterface {
  constructor(private httpService: HttpService,
              private sshService: SshService,
              private basicService: BasicService) {
  }

  getName(): DatabaseEnum {
    return DatabaseEnum.elasticsearch;
  }

  getResponse(configure: RequestModel, sql?: string): Promise<ResponseModel> {
    const network = this.getConfig().network * 1000;
    const response = new ResponseModel();
    const start = new Date().getTime();
    const somePromise = new Promise((resolve) => {
      const body = {query: sql};
      const options = {
        hostname: configure.config.host,
        port: configure.config.port,
        path: configure.config.url,
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
      }
      const req = http.request(options, (response) => {
        const bodyArray = [];
        response.on('data', (chunk) => {
          bodyArray.push(chunk);
        })
          .on('error', function (err) {
            console.log('HTTP :: ERROR: ' + err);
            response.status = false;
            response.message = err;
            resolve(response);
          })
          .on('end', function () {
            if (response.statusCode === 200) {
              const body = JSON.parse(Buffer.concat(bodyArray).toString());
              const responseData = new ResponseDataModel();
              responseData.headers = body['columns'];
              const rows = new Array();
              /** Parse Elasticsearch to return the original data, the original format is
               {
                  "columns": [
                      {
                          "name": "name",
                          "type": "keyword"
                      },
                      {
                          "name": "type",
                          "type": "keyword"
                      }
                  ],
                  "rows": [
                      [
                          "AVG",
                          "AGGREGATE"
                      ]
                  ]
              }
               */
              const keys = Object.keys(body['columns']);
              body['rows'].forEach(row => {
                const column = {};
                keys.forEach(index => {
                  const title = responseData.headers[index].name;
                  column[title] = row[index];
                });
                rows.push(column);
              });
              responseData.columns = rows;
              responseData.rows = responseData.columns.length;
              const end = new Date().getTime();
              const statistics = {
                elapsed: end - start
              };
              responseData.statistics = statistics;
              response.data = responseData;
              response.status = true;
            } else {
              response.status = false;
              const errorJson = JSON.parse(Buffer.concat(bodyArray).toString());
              response.message = errorJson['error']['reason'];
            }
            resolve(response);
          });
      })

      req.on('error', error => {
        const response = new ResponseModel();
        response.status = false;
        response.message = error;
        resolve(response);
      })
      req.end(JSON.stringify(body));
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

  private getConfig(): SystemBasicModel {
    return this.basicService.get() === null ? new SystemBasicModel() : this.basicService.get();
  }
}
