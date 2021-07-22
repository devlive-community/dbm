import { getAuthenticationResponse } from '@/services/Common'
import Authentication from '@/store/modules/Authentication'

export async function getQuery(server, query) {
  const configuration = new Authentication()
  configuration.server = server
  return await getAuthenticationResponse(configuration, query)
}
