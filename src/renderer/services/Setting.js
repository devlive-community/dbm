import Support from '@/store/Support'
import { isEmpty } from '../utils/StringUtils'
import { DEFAULT } from '../utils/SqlUtils'

const StringUtils = require('../utils/StringUtils')

const token = Support.SETTING

/**
 * Buffer the configuration of the specified key
 * @param {*} formBody configuration
 * @param {*} key specified key
 */
export async function bufferSetting(formBody, key) {
  if (formBody) {
    localStorage.setItem(StringUtils.format('{0}_{1}', [token, key]), JSON.stringify(formBody))
  }
}

/**
 * Get the configuration according to the specified key
 * @param {*} key specified key
 * @returns configuration
 */
export async function getSetting(key) {
  return await JSON.parse(localStorage.getItem(StringUtils.format('{0}_{1}', [token, key])))
}

export function getFormatter() {
  let formatter = JSON.parse(localStorage.getItem(StringUtils.format('{0}_{1}', [token, 'Editor']))).formatter
  if (isEmpty(formatter)) {
    formatter = DEFAULT
  }
  return formatter
}
