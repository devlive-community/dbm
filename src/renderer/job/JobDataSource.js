import { getDataSources, getConnection, updateDataSource } from '@/services/DataSource'

/**
 * Check the availability of the data source
 */
export async function jobOfCheckHealth() {
  const dataSources = getDataSources(null).columns
  dataSources.forEach(async element => {
    const response = await getConnection(element.host, element.port, element.username, element.password)
    if (response.status !== element.status) {
      element.status = response.status
      element.message = response.message
      updateDataSource(element.name, element)
    }
  })
}
