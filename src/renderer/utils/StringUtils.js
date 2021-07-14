import { getLengthEqZore } from '@/utils/Utils'

export function isEmpty(source) {
  return getLengthEqZore(source)
}

export function isNotEmpty(source) {
  return !isEmpty(source)
}
