import { runExecute } from '@/api/query'
import { getServerURL, getDataSource, formatRemoteUrl } from '@/utils/Utils'
import Response from '@/store/modules/Response'

const StringUtils = require('../utils/StringUtils')

export async function getResponse(server, sql) {
  const dataSource = getDataSource(server)
  const remoteServer = getServerURL(dataSource[0].host, dataSource[0].port, null)
  const result = new Response()
  await runExecute(remoteServer, sql).then(response => {
    if (response.status === 200) {
      result.columns = response.data.data
      result.status = true
    }
  }).catch(response => {
    result.message = response.data
    result.status = false
  })
  return result
}

export async function getAuthenticationResponse(authentication, sql) {
  let configuration = null
  if (StringUtils.isNotEmpty(authentication.server)) {
    const dataSource = getDataSource(authentication.server)
    configuration = dataSource[0]
  } else {
    configuration = authentication
  }
  const result = new Response()
  await runExecute(formatRemoteUrl(configuration), sql).then(response => {
    if (response.status === 200) {
      if (response.data) {
        result.headers = response.data.meta
        result.columns = response.data.data
        result.rows = response.data.rows
        result.statistics = response.data.statistics
      } else {
        result.message = 'Operation successful!'
      }
      result.status = true
    }
  }).catch(response => {
    result.message = response.data
    result.status = false
  })
  return result
}
