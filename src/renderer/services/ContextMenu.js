const StringUtils = require('../utils/StringUtils')
const Support = require('../utils/Support')
import i18n from '../i18n'

export function getContextMenu(type) {
  if (StringUtils.isEmpty(type)) {
    type = Support.SERVER
  }
  const menus = []
  const add = {
    name: i18n.t('common.add'),
    command: Support.ADD,
    icon: Support.ADD_ICON
  }
  switch (type) {
    case Support.SERVER:
      add.type = Support.SERVER
      menus.push(add, {
        name: i18n.t('common.infomation'),
        command: Support.INFO,
        icon: Support.INFO_ICON,
        type: Support.SERVER
      })
      break
  }
  return menus
}
