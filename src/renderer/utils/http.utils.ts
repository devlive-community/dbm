import axios from 'axios';

const timeout = 10 * 1000;

export class HttpUtils {
  public static post(url, data = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      axios.post(url, data, {timeout})
      .then(response => {
        resolve(response);
      }, error => {
        if (error.response) {
          reject(error.response);
        } else {
          const result = {
            data: error.message
          };
          reject(result);
        }
      });
    });
  }
}
