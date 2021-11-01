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
      },
      {
        name: i18n.t('table.engine.integration.hdfs.name'),
        description: i18n.t('table.engine.integration.hdfs.description')
      },
      {
        name: i18n.t('table.engine.integration.jdbc.name'),
        description: i18n.t('table.engine.integration.jdbc.description')
      },
      {
        name: i18n.t('table.engine.integration.sqlite.name'),
        description: i18n.t('table.engine.integration.sqlite.description')
      }
    ]
  }
]

/**
 * Verify that the table engine supports the ALTER operation
 * @param engine table engine
 * @returns {boolean} supported
 */
export function checkSupportAlter(engine) {
  switch (engine) {
    case 'Kafka':
    case 'TinyLog':
    case 'StripeLog':
    case 'Log':
      return false
    default:
      return true
  }
}
