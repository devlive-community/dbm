import { checkHealth } from '@/api/query'
import { stringFormat, getValue } from '@/utils/Utils'
import DataSource from '@/store/modules/DataSource'
import Response from '@/store/modules/Response'

const token = 'DataSources'

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
    response.message = stringFormat('DataSouece <{0}> Save Error, exists!', [formBody.name])
  } else {
    const dataSources = getDataSources(null).columns
    const dataSource = new DataSource()
    dataSource.name = getValue(formBody.name, dataSource.name)
    dataSource.host = getValue(formBody.host, dataSource.host)
    dataSource.port = getValue(formBody.port, dataSource.port)
    dataSource.userName = getValue(formBody.userName, dataSource.userName)
    dataSource.password = getValue(formBody.password, dataSource.password)
    dataSources.push(dataSource)
    localStorage.setItem(token, JSON.stringify(dataSources))
    response.status = true
    response.message = stringFormat('DataSouece <{0}> Save Success!', [formBody.name])
  }
  return response
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
export async function getConnection(host, port) {
  const serverUrl = stringFormat('http://{0}:{1}', [host, port])
  const result = new Response()
  await checkHealth(serverUrl).then(response => {
    if (response.status === 200) {
      if (response.data.indexOf('Ok') !== -1) {
        result.status = true
        result.message = stringFormat('ClickHouse Server <{0}> connection successful!', [host])
      } else {
        result.status = false
        result.message = 'Please check whether the version of Clickhouse supports it!'
      }
    }
  }).catch(response => {
    if (response) {
      response.message = response.data
    } else {
      result.message = 'Please check whether the version of Clickhouse supports it!'
    }
    result.status = false
  })
  return result
}
