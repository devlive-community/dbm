import { runExecute } from '@/api/query'
import { getDataSource, getServerURL } from '@/utils/Utils'
import { getAuthenticationResponse } from '@/services/Common'
import QueryHistory from '@/store/modules/QueryHistory'
import Response from '@/store/modules/Response'
import Authentication from '@/store/modules/Authentication'
import i18n from '@/i18n'

const StringUtils = require('../utils/StringUtils')

/**
 * Get Database or table from remote server
 * @param {*} server remote server
 * @param {*} type database or table
 * @param {*} database database name
 * @returns common response
 */
export async function getDatabasesOrTables(server, type, database) {
  let querySql = null
  switch (type) {
    case 'database':
      querySql = 'SHOW DATABASES'
      break
    case 'table':
      querySql = StringUtils.format('SELECT name, engine FROM system.tables WHERE database = \'{0}\'', [database])
      break
  }
  const configuration = new Authentication()
  configuration.server = server
  return await getAuthenticationResponse(configuration, querySql)
}

/**
 * Generate quick sql
 * @param {*} quick quick type
 * @param {*} database database name
 * @param {*} table table name
 * @returns quick sql
 */
export function getQuickSql(quick, database, table) {
  let quickSql = ''
  switch (quick) {
    case 'DESCRIBE':
      quickSql = StringUtils.format('DESCRIBE {0}.{1}', [database, table])
      break
    case 'LIMIT':
      quickSql = StringUtils.format('SELECT * FROM {0}.{1} LIMIT 100', [database, table])
      break
    case 'CREATE_TABLE':
      quickSql = StringUtils.format('SHOW CREATE TABLE {0}.{1}', [database, table])
      break
    case 'SELECT_COUNT':
      quickSql = StringUtils.format('SELECT COUNT(1) FROM {0}.{1}', [database, table])
      break
  }
  return quickSql
}

/**
 * Get query response from remote server
 * @param {*} server remote server
 * @param {*} query query sql
 * @returns query response
 */
export async function getQuery(server, query) {
  let result = {}
  const queryHistory = new QueryHistory()
  queryHistory.server = server
  queryHistory.query = query
  queryHistory.startTime = Date.parse(new Date())
  const dataSource = getDataSource(server)
  if (dataSource[0].delivery && query.toLowerCase().startsWith('drop') > 0) {
    const message = i18n.t('prompt.component.warning_drop')
    result.message = message
    result.status = false
    queryHistory.status = false
    queryHistory.message = message
  } else {
    const configuration = new Authentication()
    configuration.server = server
    const response = await getAuthenticationResponse(configuration, query)
    if (response.status) {
      queryHistory.status = true
    } else {
      queryHistory.status = false
      queryHistory.message = response.message
    }
    result = response
  }
  queryHistory.endTime = Date.parse(new Date())
  queryHistory.elapsedTime = queryHistory.endTime - queryHistory.startTime
  saveQuery(queryHistory)
  return result
}

/**
 * save query history
 * @param {*} queryHistory query history
 * @returns query history
 */
export function saveQuery(queryHistory) {
  let histroy = JSON.parse(localStorage.getItem('QueryHistory'))
  histroy = histroy === null ? [] : histroy
  let index = 1
  if (histroy.length > 0) {
    index = histroy.length + 1
  }
  if (index < 100) {
    queryHistory.id = index
    histroy.unshift(queryHistory)
    localStorage.setItem('QueryHistory', JSON.stringify(histroy))
  }
  return queryHistory
}

/**
 * get history
 * @returns query history
 */
export function getQueryHistory() {
  const response = new Response()
  response.status = true
  const queryHistory = JSON.parse(localStorage.getItem('QueryHistory'))
  const history = queryHistory === null ? [] : queryHistory
  if (history.length > 0) {
    const headers = []
    Object.keys(history[0]).forEach(key => {
      headers.push({
        'name': key,
        'type': 'String'
      })
    })
    response.headers = headers
    response.columns = history
  }
  return response
}

/**
 * remove query history
 */
export function clearQueryHistory() {
  localStorage.removeItem('QueryHistory')
}

/**
 * Kill Query
 * @param {*} server remote server
 * @param {*} source source id
 * @param {*} target target id
 * @returns kill response
 */
export async function killQuery(server, source, target, type) {
  const dataSource = getDataSource(server)
  const remoteServer = getServerURL(dataSource[0].host, dataSource[0].port, null)
  const result = new Response()
  if (source !== target) {
    result.message = i18n.t('alter.contrast_input')
    result.status = false
  } else {
    let sql = null
    switch (type) {
      case 'mutation':
        sql = StringUtils.format('KILL MUTATION WHERE mutation_id = \'{0}\'', [source])
        break
      default:
        sql = StringUtils.format('KILL QUERY WHERE query_id = \'{0}\'', [source])
    }
    await runExecute(remoteServer, sql).then(response => {
      if (response.status === 200) {
        result.message = StringUtils.format('{0} {1} {2}', [i18n.t('common.kill'), source, i18n.t('common.success')])
        result.status = true
      }
    }).catch(response => {
      result.message = response.data
      result.status = false
    })
  }
  return result
}
