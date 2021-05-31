import { post } from '@/utils/query'

export function runExecute(host, sql) {
  return post(host, sql + '\n FORMAT JSON')
}
