// cd src/example && node --loader ts-node/esm ./axios-ssh.ts

import axios, { AxiosInstance } from 'axios';
import * as tunnel from 'tunnel';

const SSH_HOST = 'localhost';
const SSH_PORT = 22;
const SSH_USERNAME = 'root';
const SSH_PASSWORD = '123456';
const agent = tunnel.httpsOverHttp({
  proxy: {
    host: SSH_HOST,
    port: SSH_PORT,
    proxyAuth: `${SSH_USERNAME}:${SSH_PASSWORD}`
  }
});
const axiosClient: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8123',
  httpsAgent: agent
});
axiosClient.get('/ping').then(resp => {
  console.log(resp.data);
}).catch(e => {
  console.log(e.message);
});
