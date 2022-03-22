const axios = require('axios');
const Client = require('electron-ssh2').Client;
const conn = new Client();
conn.on('ready', function() {
  console.log('Client :: ready');
  const ClickHouse = require('@apla/clickhouse');
  const ch = new ClickHouse({
    host: 'localhost',
    port: 8123,
    username: '',
    password: ''
  });
  const stream = ch.query('SELECT 1', (err, data) => {
    console.log(err, data)
  });
  stream.pipe(process.stdout);
  conn.forwardOut('', 0, '127.0.0.1', 8123, function(err, stream) {
    if (err) throw err;
    stream.on('close', function() {
      console.log('TCP :: CLOSED');
      conn.end();
    })
    .on('data', function(data) {
      console.log('TCP :: DATA: ' + data);
    })
    .end([
      'HEAD / HTTP/1.1',
      'User-Agent: curl/7.27.0',
      'Host: 127.0.0.1',
      'Accept: */*',
      'Connection: close',
      '',
      ''
    ].join('\r\n'));
  });
}).connect({
  host: 'localhost',
  port: 22,
  username: 'root',
  password: '12345678'
});
