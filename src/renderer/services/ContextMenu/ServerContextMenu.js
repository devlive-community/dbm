/**
 * Right-click menus available for services
 */
import i18n from '../../i18n'

const Support = require('../../utils/Support')
const StringUtils = require('../../utils/StringUtils')

export function getContextMenu(type) {
  const menus = []
  if (type === Support.SERVER) {
    menus.push({
      name: StringUtils.format('{0}{1}', [i18n.t('common.add'), i18n.t('common.database')]),
      command: Support.ADD,
      type: Support.SERVER,
      icon: Support.ADD_ICON
    }, {
      name: i18n.t('common.information'),
      command: Support.INFO,
      icon: Support.INFO_ICON,
      type: Support.SERVER
    })
  }
  return menus
}
