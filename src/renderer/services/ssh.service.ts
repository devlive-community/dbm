import { Injectable } from '@angular/core';
import { SystemBasicModel } from '@renderer/model/system.model';
import { BasicService } from '@renderer/services/system/basic.service';
import { SshModel } from '@renderer/model/ssh.model';
import { ResponseDataModel, ResponseModel } from '@renderer/model/response.model';
import { StringUtils } from '@renderer/utils/string.utils';

@Injectable()
export class SshService {
  private basicConfig: SystemBasicModel;

  constructor(private basicService: BasicService) {
  }

  private getConfig(): SystemBasicModel {
    return this.basicService.get() === null ? new SystemBasicModel() : this.basicService.get();
  }

  post(data = {}, sshConfigure: SshModel): Promise<any> {
    return new Promise((resolve, reject) => {
      const http = require('http');
      const Client = require('electron-ssh2').Client;
      const conn = new Client();
      conn.on('ready', function() {
        console.log('Ssh Client :: ready');
        const response = new ResponseModel();
        conn.forwardOut('', 0, sshConfigure.localHost, sshConfigure.localPort, function(err, stream) {
          if (err) {
            response.status = false;
            response.message = err;
            resolve(response);
          }
          console.log('Ssh Client :: forwardOut');
          let path = '/';
          const hasAuthentication = (StringUtils.isNotEmpty(sshConfigure.localUsername) && StringUtils.isNotEmpty(sshConfigure.localPassword));
          if (hasAuthentication) {
            path = StringUtils.format('/?user={0}&password={1}',
              [sshConfigure.localUsername, sshConfigure.localPassword]);
          }
          console.log('Ssh Client :: path', path);
          // Setup HTTP request parameters
          const requestParams = {
            method: 'POST',
            path: encodeURI(path),
            headers: {},
            timeout: 3,
            createConnection: function() {
              return stream;
            }
          };
          const request = http.request(requestParams, function(response) {
            console.log('STATUS: ' + response.statusCode);
            const bodyArray = [];
            response.on('data', function(chunk) {
              console.log('BODY Length: ' + chunk.length);
              bodyArray.push(chunk);
            })
            .on('error', function(err) {
              console.log('HTTP :: ERROR: ' + err);
              stream.on('close', function() {
                console.log('HTTP :: Stream closed');
                conn.end();
              }).end();
              response.status = false;
              response.message = err;
              resolve(response);
            })
            .on('end', function() {
              console.log('HTTP :: Stream ended');
              stream.on('close', function() {
                console.log('HTTP :: Stream closed');
                conn.end();
              }).end();
              if (response.statusCode === 200) {
                try {
                  const body = JSON.parse(Buffer.concat(bodyArray).toString());
                  const responseData = new ResponseDataModel();
                  responseData.headers = body['meta'];
                  responseData.columns = body['data'];
                  responseData.rows = body['rows'];
                  responseData.statistics = body['statistics'];
                  response.data = responseData;
                } catch (e) {
                  response.message = 'Success';
                }
                response.status = true;
              } else {
                response.status = false;
                response.message = Buffer.concat(bodyArray).toString();
              }
              resolve(response);
            });
          });
          request.on('timeout', function() {
            console.log('HTTP :: Timeout');
            response.status = false;
            response.message = 'Connection timeout';
            resolve(response);
            request.destroy();
          })
          .on('error', function(err) {
            console.log('HTTP :: ERROR: ' + err);
            stream.on('close', function() {
              console.log('HTTP :: Stream closed');
              conn.end();
            }).end();
            response.status = false;
            response.message = err;
            resolve(response);
          });
          console.log('HTTP :: Sending request');
          request.end(data);
        });
      })
      .on('error', function(err) {
        console.log('Client :: error :: ' + err);
        const response = new ResponseModel();
        response.status = false;
        response.message = err;
        resolve(response);
      })
      .on('end', function() {
        console.log('Client :: stream :: ended');
        conn.end();
      })
      .connect({
        host: sshConfigure.sshHost,
        port: sshConfigure.sshPort,
        username: sshConfigure.sshUsername,
        password: sshConfigure.sshPassword,
        timeout: sshConfigure.timeout
      });
    });
  }
}
