import axios from 'axios';
import { ResponseDataModel, ResponseModel } from '@renderer/model/response.model';

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
const timeout = 10 * 1000;

export class HttpUtils {
  public static post(url, data = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      axios.post(url, data, {timeout})
      .then(rs => {
        const response = new ResponseModel();
        if (rs.status === 200) {
          if (response.data) {
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
          response.message = error.response;
        } else {
          response.message = error;
        }
        resolve(response);
      });
    });
  }
}
