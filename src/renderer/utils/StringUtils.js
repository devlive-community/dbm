export function isEmpty(source) {
  return getLengthEqZone(source)
}

export function isNotEmpty(source) {
  return !isEmpty(source)
}

/**
 * Format string
 * <p>stringFormat('format {0}', ['test']) return 'format test'</p>
 * @param {*} formatted format style
 * @param {*} args format param
 * @returns formatted string
 */
export function format(formatted, args) {
  for (let i = 0; i < args.length; i++) {
    const regexp = new RegExp('\\{' + i + '\\}', 'gi')
    formatted = formatted.replace(regexp, args[i])
  }
  return formatted
}

export function getLength(source) {
  if (source !== undefined && source !== null) {
    return source.length
  }
  return 0
}

export function getLengthGtZone(source) {
  return getLength(source) > 0
}

export function getLengthLtZone(source) {
  return getLength(source) < 0
}

export function getLengthEqZone(source) {
  return getLength(source) === 0
}
