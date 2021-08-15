import { getLength } from '@/utils/Utils'
import { isEmpty } from '@/utils/StringUtils'

export function builderTree(array, type) {
  const elements = []
  if (getLength(array) > 0) {
    array.forEach(e => {
      const element = {}
      const id = isEmpty(e.id) ? e.name : e.id
      element.id = id
      element.name = e.name
      element.type = type
      elements.push(element)
    })
  }
  return elements
}
