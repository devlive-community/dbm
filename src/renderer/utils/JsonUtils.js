const StringUtils = require('../utils/StringUtils')

export function builderTree(array, type) {
  const elements = []
  if (StringUtils.getLength(array) > 0) {
    array.forEach(e => {
      const element = {}
      const id = StringUtils.isEmpty(e.id) ? e.name : e.id
      element.id = id
      element.name = e.name
      element.type = type
      elements.push(element)
    })
  }
  return elements
}
