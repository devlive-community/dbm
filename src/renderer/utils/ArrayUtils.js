import { getLength } from '@/utils/Utils'

/**
 * Build new array
 * @param {*} array source array
 * @param {*} max max length
 * @param {*} deleteLogic delete logic true=start, false=end
 * @param {*} data push data
 */
export function buildArray(array, max, deleteLogic, data) {
  const newArray = array
  if (array instanceof Array) {
    if (getLength(array) > max) {
      if (deleteLogic) {
        newArray.shift()
      } else {
        newArray.pop()
      }
      newArray.push(data)
    } else {
      newArray.push(data)
    }
  }
  return newArray
}
