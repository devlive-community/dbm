import i18n from '../i18n'

export const ENGINES = [
  {
    name: i18n.t('table.engine.log.name'),
    description: i18n.t('table.engine.log.description'),
    engines: [
      {
        name: i18n.t('table.engine.log.name'),
        description: i18n.t('table.engine.log.description')
      },
      {
        name: i18n.t('table.engine.log.tiny'),
        description: i18n.t('table.engine.log.description')
      },
      {
        name: i18n.t('table.engine.log.stripe'),
        description: i18n.t('table.engine.log.description')
      }
    ]
  },
  {
    name: i18n.t('table.engine.integration.name'),
    description: i18n.t('table.engine.integration.description'),
    engines: [
      {
        name: i18n.t('table.engine.integration.kafka.name'),
        description: i18n.t('table.engine.integration.kafka.description')
      }
    ]
  }
]
