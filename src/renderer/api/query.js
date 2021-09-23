const HttpUtils = require('../utils/HttpUtils')

export function runExecute(host, sql) {
  return HttpUtils.post(host, sql + '\n FORMAT JSON')
}

export function checkHealth(host) {
  return HttpUtils.get(host)
}
