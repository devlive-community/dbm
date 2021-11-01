import i18n from '../i18n'

const StringUtils = require('./StringUtils')

export const ENGINES = [
  {
    name: StringUtils.format('{0}{1}', [i18n.t('common.database'), i18n.t('common.engine')]),
    description: StringUtils.format('{0}{1}', [i18n.t('common.database'), i18n.t('common.engine')]),
    engines: [
      {
        name: i18n.t('database.engine.default.name'),
        description: i18n.t('database.engine.default.description')
      },
      {
        name: i18n.t('database.engine.atomic.name'),
        description: i18n.t('database.engine.atomic.description')
      },
      {
        name: i18n.t('database.engine.lazy.name'),
        description: i18n.t('database.engine.lazy.description')
      },
      {
        name: i18n.t('database.engine.mysql.name'),
        description: i18n.t('database.engine.mysql.description')
      }
    ]
  },
  {
    name: StringUtils.format('{0}{1} ({2})',
      [i18n.t('common.database'),
        i18n.t('common.engine'),
        i18n.t('common.experimental')]),
    description: i18n.t('alter.experimental'),
    engines: [
      {
        name: i18n.t('database.engine.materialized.mysql.name'),
        description: i18n.t('database.engine.materialized.mysql.description')
      }
    ]
  }
]
