import { getDataSources, getConnection, updateDataSource } from '@/services/DataSource'

/**
 * Check the availability of the data source
 */
export async function jobOfCheckHealth() {
  const dataSources = getDataSources(null).columns
  dataSources.forEach(async element => {
    const response = await getConnection(element.name, element.port)
    if (response.status !== element.status) {
      element.status = response.status
      updateDataSource(element.name, element)
    }
  })
}
