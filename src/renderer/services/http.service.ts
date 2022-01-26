import axios from 'axios';
import { ResponseDataModel, ResponseModel } from '@renderer/model/response.model';
import { BasicService } from '@renderer/services/system/basic.service';
import { SystemBasicModel } from '@renderer/model/system.model';
import { Injectable } from '@angular/core';

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

@Injectable()
export class HttpService {
  private basicConfig: SystemBasicModel;

  constructor(private basicService: BasicService) {
  }

  private getConfig(): SystemBasicModel {
    return this.basicService.get() === null ? new SystemBasicModel() : this.basicService.get();
  }

  post(url, data = {}): Promise<any> {
    this.basicConfig = this.getConfig();
    const network = this.basicConfig.network * 1000;
    return new Promise((resolve, reject) => {
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
