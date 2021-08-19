const StringUtils = require('./StringUtils')

const tab = '    '

export function buildDdl(element) {
  let response = null
  if (StringUtils.isNotEmpty(element)) {
    response = StringUtils.format('CREATE TABLE {0}.{1} (\n', [element.database, element.table.name])
    response += StringUtils.format('{0}\n', [builderColumnsToString(element.table.columns)])
    const engineProperty = builderEngineProperty(element.table.engine, element.table.property)
    if (StringUtils.isNotEmpty(engineProperty)) {
      response += StringUtils.format(') ENGINE = {0}\n SETTINGS\n', [element.type])
      response += engineProperty
    } else {
      response += StringUtils.format(') ENGINE = {0}\n', [element.type])
    }
  }
  return response
}

function builderColumnsToString(columns) {
  let columnStr = ''
  columns.forEach((value, index) => {
    if (index !== columns.length - 1) {
      columnStr += builderColumnToString(value, true)
    } else {
      columnStr += builderColumnToString(value, false)
    }
  })
  return columnStr
}

function builderColumnToString(value, end) {
  let column
  const dStr = StringUtils.format('    {0} {1}', [value.name, value.type])
  const endStr = end ? ',\n' : ''
  if (StringUtils.isNotEmpty(value.comment)) {
    column = StringUtils.format(`    {0} COMMENT '{1}' {2}`, [dStr, value.comment, endStr])
  } else {
    column = StringUtils.format('    {0} {1}', [dStr, endStr])
  }
  return column
}

function builderEngineProperty(engine, property) {
  let engineProperty
  if (StringUtils.isNotEmpty(property)) {
    switch (engine) {
      case 'Kafka':
        engineProperty = builderEngineKafka(property)
        break
    }
  }
  return engineProperty
}

/**
 * Builder Kafka Engine parameter (only Required)
 * @param property parameter, example:
 * <code>
 *   {
 *       "broker": "1",
 *       "format": "JSONEachRow",
 *       "group": "1",
 *       "topic": "1"
 *   }
 * </code>
 * @returns {string} string
 */
function builderEngineKafka(property) {
  let engineProperty = ''
  if (StringUtils.isNotEmpty(property.broker)) {
    engineProperty += StringUtils.format(`{0}kafka_broker_list = '{1}',\n`, [tab, property.broker])
  }
  if (StringUtils.isNotEmpty(property.topic)) {
    engineProperty += StringUtils.format(`{0}kafka_topic_list = '{1}',\n`, [tab, property.topic])
  }
  if (StringUtils.isNotEmpty(property.group)) {
    engineProperty += StringUtils.format(`{0}kafka_group_name = '{1}',\n`, [tab, property.group])
  }
  if (StringUtils.isNotEmpty(property.format)) {
    engineProperty += StringUtils.format(`{0}kafka_format = '{1}'`, [tab, property.format])
  }
  return engineProperty
}
