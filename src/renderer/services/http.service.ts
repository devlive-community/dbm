import axios from 'axios';
import { ResponseDataModel, ResponseModel } from '@renderer/model/response.model';
import { BasicService } from '@renderer/services/system/basic.service';
import { SystemBasicModel } from '@renderer/model/system.model';
import { Injectable } from '@angular/core';
import { StringUtils } from "@renderer/utils/string.utils";

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

@Injectable()
export class HttpService {
  private basicConfig: SystemBasicModel;

  constructor(private basicService: BasicService) {
  }

  private getConfig(): SystemBasicModel {
    return this.basicService.get() === null ? new SystemBasicModel() : this.basicService.get();
  }

  post(url, data = {}, isBody?: boolean): Promise<any> {
    this.basicConfig = this.getConfig();
    const network = this.basicConfig.network * 1000;
    if (isBody) {
      return new Promise((resolve) => {
        const body = {
          header: true,
          query: data
        }
        const start = new Date().getTime();
        axios.post(url, body, {timeout: network})
          .then(rs => {
            const response = new ResponseModel();
            if (rs.status === 200) {
              if (rs.data) {
                const responseData = new ResponseDataModel();
                const headers = []
                Object.keys(rs.data[0]).forEach(item => {
                  const header = {
                    name: item,
                    type: ''
                  };
                  headers.push(header);
                });
                responseData.headers = headers;
                responseData.columns = rs.data.slice(1);
                responseData.rows = responseData.columns.length;
                const end = new Date().getTime();
                const statistics = {
                  elapsed: end - start
                };
                responseData.statistics = statistics;
                responseData.statistics = statistics;
                response.data = responseData;
              } else {
                response.message = 'Success';
              }
              response.status = true;
            }
            resolve(response);
          }, error => {
            const response = new ResponseModel();
            response.status = false;
            if (error.response) {
              response.message = StringUtils.format('{0}\n{1}\n{2}',
                [error.response.data.error, error.response.data.errorClass, error.response.data.errorMessage]);
            } else {
              response.message = error;
            }
            resolve(response);
          });
      });
    } else {
      return new Promise((resolve) => {
        axios.post(url, data + '\n FORMAT ' + this.basicConfig.format, {timeout: network})
          .then(rs => {
            const response = new ResponseModel();
            if (rs.status === 200) {
              if (rs.data) {
                const responseData = new ResponseDataModel();
                responseData.headers = rs.data.meta;
                responseData.columns = rs.data.data;
                responseData.rows = rs.data.rows;
                responseData.statistics = rs.data.statistics;
                response.data = responseData;
              } else {
                response.message = 'Success';
              }
              response.status = true;
            }
            resolve(response);
          }, error => {
            const response = new ResponseModel();
            response.status = false;
            if (error.response) {
              response.message = error.response.data;
            } else {
              response.message = error;
            }
            resolve(response);
          });
      });
    }
  }
}
