// cd src/example && node --loader ts-node/esm ./axios-tunnel-ssh.ts

import axios from 'axios';
import tunnel from 'tunnel-ssh';

const SSH_HOST = 'localhost';
const SSH_PORT = 22;
const SSH_USERNAME = 'root';
const SSH_PASSWORD = '123456';
const agent = {
  username: SSH_USERNAME,
  host: SSH_HOST,
  password: SSH_PASSWORD,
  agent: process.env.SSH_AUTH_SOCK,
  port: 22,
  dstPort: 8123
};
tunnel(agent, function(error, server) {
  if (error) {
    console.log('SSH connection error: ' + error);
  }
  axios.get('http://127.0.0.1:8123/ping').then(resp => {
    console.log(resp.data);
  }).catch(e => {
    console.log(e.message);
  });
});
