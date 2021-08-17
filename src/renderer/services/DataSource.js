import { getValue, formatAuthentication } from '@/utils/Utils'
import { getAuthenticationResponse } from '@/services/Common'
import Support from '@/store/Support'
import DataSource from '@/store/modules/DataSource'
import Response from '@/store/modules/Response'

const StringUtils = require('../utils/StringUtils')

const token = Support.DATASOURCE

/**
 * Save data source
 * @param {*} formBody data source body
 * @returns common response
 */
export async function saveDataSource(formBody) {
  const response = new Response()
  const validateResponse = getDataSources(formBody.name)
  if (validateResponse.status && validateResponse.columns.length > 0) {
    response.status = false
    response.message = StringUtils.format('DataSource <{0}> Save Error, exists!', [formBody.name])
  } else {
    const dataSources = getDataSources(null).columns
    const dataSource = new DataSource()
    dataSource.name = getValue(formBody.name, dataSource.name)
    dataSource.host = getValue(formBody.host, dataSource.host)
    dataSource.port = getValue(formBody.port, dataSource.port)
    dataSource.username = getValue(formBody.username, dataSource.username)
    dataSource.password = getValue(formBody.password, dataSource.password)
    dataSource.delivery = getValue(formBody.delivery, dataSource.delivery)
    dataSource.protocol = getValue(formBody.protocol, dataSource.protocol)
    dataSources.push(dataSource)
    localStorage.setItem(token, JSON.stringify(dataSources))
    response.status = true
    response.message = StringUtils.format('DataSource <{0}> Save Success!', [formBody.name])
  }
  return response
}

/**
 * Update exists data source
 * @param {*} unique data source unique name
 * @param {*} dataSource data source info
 */
export function updateDataSource(unique, dataSource) {
  const response = new Response()
  response.status = true
  if (StringUtils.getLengthGtZone(unique)) {
    const dataSources = JSON.parse(localStorage.getItem(token)).filter(item => item.name !== unique)
    dataSources.push(dataSource)
    localStorage.setItem(token, JSON.stringify(dataSources))
    response.message = StringUtils.format('DataSource <{0}> Update Success!', [unique])
  }
  return response
}

export function getDataSource(unique) {
  let datasource
  if (StringUtils.getLengthGtZone(unique)) {
    datasource = JSON.parse(localStorage.getItem(token)).filter(item => item.name === unique)
  }
  return datasource
}

/**
 * Get source from localStroage
 * @param {*} name target name
 * @returns common response
 */
export function getDataSources(name) {
  const response = new Response()
  response.status = true
  const dataSources = JSON.parse(localStorage.getItem(token))
  const sources = dataSources === null ? [] : dataSources
  response.columns = sources
  if (sources.length > 0) {
    const headers = []
    Object.keys(sources[0]).forEach(key => {
      headers.push({
        'name': key,
        'type': 'String'
      })
    })
    response.headers = headers
    if (name) {
      response.columns = sources.filter(item => item.name === name)
    }
  }
  return response
}

/**
 * Get connection status from remote server
 * @param {*} host remote host
 * @param {*} port remote port
 * @returns response
 */
export async function getConnection(host, port, username, password) {
  const authentication = formatAuthentication(host, port, username, password)
  const querySql = 'SELECT 1'
  return await getAuthenticationResponse(authentication, querySql)
}
