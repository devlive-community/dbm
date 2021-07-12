import { runExecute } from '@/api/query'
import { getServerURL, getDataSource } from '@/utils/Utils'
import Response from '@/store/modules/Response'

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
