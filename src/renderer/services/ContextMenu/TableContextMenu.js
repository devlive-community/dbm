import i18n from '../../i18n'

/**
 * Right-click menus available for table
 */

const Support = require('../../utils/Support')
const StringUtils = require('../../utils/StringUtils')

export function getContextMenu(type) {
  const menus = []
  if (type === Support.TABLE) {
    menus.push({
      name: i18n.t('common.delete'),
      command: Support.DELETE,
      type: Support.TABLE,
      icon: Support.DELETE_ICON
    }, {
      name: StringUtils.format('{0}{1}', [i18n.t('common.add'), i18n.t('common.column')]),
      command: Support.ADD,
      icon: Support.ADD_ICON,
      type: Support.TABLE
    }, {
      name: i18n.t('common.ddl'),
      command: Support.DDL,
      icon: Support.DDL_ICON,
      type: Support.TABLE
    }, {
      name: i18n.t('common.preview'),
      command: Support.PREVIEW,
      icon: Support.PREVIEW_ICON,
      type: Support.TABLE
    }, {
      name: StringUtils.format('{0}{1}', [i18n.t('common.rename'), i18n.t('common.table')]),
      command: Support.EDIT,
      icon: Support.EDIT_ICON,
      type: Support.TABLE
    }, {
      name: StringUtils.format('{0}{1}', [i18n.t('common.truncate'), i18n.t('common.table')]),
      command: Support.TRUNCATE,
      icon: Support.TRUNCATE_ICON,
      type: Support.TABLE
    }, {
      name: StringUtils.format('{0}{1}', [i18n.t('common.clean'), i18n.t('common.table')]),
      command: Support.CLEAN,
      icon: Support.CLEAN_ICON,
      type: Support.TABLE
    })
  }
  return menus
}
