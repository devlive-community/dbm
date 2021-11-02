const StringUtils = require('../utils/StringUtils')

export function builderTree(array, type) {
  const elements = []
  if (StringUtils.getLength(array) > 0) {
    array.forEach(e => {
      const element = {}
      element.id = StringUtils.isEmpty(e.id) ? e.name : e.id
      element.name = e.name
      if (StringUtils.isEmpty(e.value)) {
        element.value = e.type
      } else {
        element.value = e.value
      }
      element.type = type
      elements.push(element)
    })
  }
  return elements
}
