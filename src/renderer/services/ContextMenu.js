import i18n from '../i18n'

const StringUtils = require('../utils/StringUtils')
const Support = require('../utils/Support')
const ServerContextMenu = require('./ContextMenu/ServerContextMenu')
const TableContextMenu = require('./ContextMenu/TableContextMenu')

export function getContextMenu(type) {
  if (StringUtils.isEmpty(type)) {
    type = Support.SERVER
  }
  let menus = []
  const add = {
    name: i18n.t('common.add'),
    command: Support.ADD,
    icon: Support.ADD_ICON
  }
  const deleted = {
    name: i18n.t('common.delete'),
    command: Support.DELETE,
    icon: Support.DELETE_ICON
  }
  switch (type) {
    case Support.SERVER:
      menus = ServerContextMenu.getContextMenu(type)
      break
    case Support.DATABASE:
      add.type = Support.DATABASE
      deleted.type = Support.DATABASE
      menus.push(add, deleted, {
        name: i18n.t('common.ddl'),
        command: Support.DDL,
        icon: Support.DDL_ICON,
        type: Support.DATABASE
      })
      break
    case Support.TABLE:
      menus = TableContextMenu.getContextMenu(Support.TABLE)
      break
    case Support.COLUMN:
      deleted.type = Support.COLUMN
      menus.push(deleted, {
        name: i18n.t('common.edit'),
        command: Support.EDIT,
        icon: Support.EDIT_ICON,
        type: Support.COLUMN
      }, {
        name: i18n.t('common.rename'),
        command: Support.RENAME,
        icon: Support.EDIT_ICON,
        type: Support.COLUMN
      }, {
        name: i18n.t('common.preview'),
        command: Support.PREVIEW,
        icon: Support.PREVIEW_ICON,
        type: Support.COLUMN
      }, {
        name: i18n.t('common.information'),
        command: Support.INFO,
        icon: Support.INFO_ICON,
        type: Support.COLUMN
      })
      break
  }
  return menus
}
