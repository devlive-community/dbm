const StringUtils = require('./StringUtils')

const tab = '    '

export function buildDdl(element) {
  let response = null
  if (StringUtils.isNotEmpty(element)) {
    response = StringUtils.format('CREATE TABLE {0}.{1} (\n',
      [element.configure.database, element.configuration.name])
    response += StringUtils.format('{0}\n', [builderColumnsToString(element.configuration.columns)])
    const engineProperty = builderEngineProperty(element.configuration.engine, element.configuration.property)
    if (element.configuration.engine !== 'HDFS') {
      if (StringUtils.isNotEmpty(engineProperty)) {
        response += StringUtils.format(') ENGINE = {0}\n SETTINGS\n', [element.type])
        response += engineProperty
      } else {
        response += StringUtils.format(') ENGINE = {0}\n', [element.type])
      }
    } else {
      response += StringUtils.format(') ENGINE = {0}\n{1}', [element.type, engineProperty])
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
      case 'HDFS':
        engineProperty = builderEngineHdfs(property)
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

/**
 * Builder HDFS Engine parameter
 * @param property parameter, example:
 * <code>
 *   {
 *       "uri": "hdfs://hdfs1:9000/other_storage",
 *       "format": "Parquet"
 *   }
 * </code>
 * @returns {string} string
 */
function builderEngineHdfs(property) {
  let engineProperty = ''
  if (StringUtils.isNotEmpty(property.uri)) {
    engineProperty += StringUtils.format(`({0}'{1}',\n`, [tab, property.uri])
  }
  if (StringUtils.isNotEmpty(property.format)) {
    engineProperty += StringUtils.format(`{0}'{1}')\n`, [tab, property.format])
  }
  return engineProperty
}
