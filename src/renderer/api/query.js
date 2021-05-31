import { post, get } from '@/utils/query'

export function runExecute(host, sql) {
  return post(host, sql + '\n FORMAT JSON')
}

export function checkHealth(host) {
  return get(host)
}
