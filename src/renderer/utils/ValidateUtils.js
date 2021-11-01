const StringUtils = require('./StringUtils')

/**
 * The loop recurses to check whether the parameter contains null data
 * @param config parameter
 * @returns {boolean}
 */
export function validate(config) {
  const empty = Object.keys(config).filter(item => StringUtils.isEmpty(config[item]))
  if (empty.length <= 0) {
    return true
  } else {
    return false
  }
}
