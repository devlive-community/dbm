const http = require('http');
const Client = require('electron-ssh2').Client;
const conn = new Client();
conn.on('ready', function() {
  console.log('Ssh Client :: ready');
  conn.forwardOut('', 0, '127.0.0.1', 8123, function(err, stream) {
    if (err) throw err;
    console.log('Ssh Client :: forwardOut');
    // Setup HTTP request parameters
    const postData = 'select sleep(1), version() format JSON';
    const requestParams = {
      method: 'POST',
      path: '/',
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
        bodyArray.push(chunk);
        // Do whatever you need to do with 'chunk' (the response body)
        // Note, this may be called more than once if the response data is long
      })
      .on('error', function(err) {
        console.log('HTTP :: ERROR: ' + err);
        stream.on('close', function() {
          console.log('HTTP :: Stream closed');
          conn.end();
        }).end();
      })
      .on('end', function() {
        console.log('HTTP :: Stream ended');
        stream.on('close', function() {
          console.log('HTTP :: Stream closed');
          conn.end();
        }).end();
        const body = Buffer.concat(bodyArray).toString();
        console.log('HTTP :: Body: ' + body);
      });
    });
    request.on('timeout', function() {
      console.log('HTTP :: Timeout');
      request.destroy();
    });
    request.on('error', function(err) {
      console.log('HTTP :: ERROR: ' + err);
      stream.on('close', function() {
        console.log('HTTP :: Stream closed');
        conn.end();
      }).end();
    });
    console.log('HTTP :: Sending request');
    request.end(postData);
  });
})
.on('error', function(err) {
  console.log('Client :: error :: ' + err);
})
.connect({
  host: '127.0.0.1',
  port: 22,
  username: 'root',
  password: '123456',
  timeout: 6000
});
