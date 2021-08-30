const StringUtils = require('../utils/StringUtils')

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
    if (StringUtils.getLength(array) > max) {
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

export function deleteByIndex(arr, index) {
  for (var i = index, len = arr.length - 1; i < len; i++) {
    arr[i] = arr[i + 1]
  }
  arr.length = len
  return arr
}
