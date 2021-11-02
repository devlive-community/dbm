import { getConnection, getDataSources, updateDataSource } from '../services/DataSource'

const StringUtils = require('../utils/StringUtils')

/**
 * Check the availability of the data source
 */
export async function jobOfCheckHealth() {
  const dataSources = getDataSources(null).columns
  dataSources.forEach(async element => {
    const response = await getConnection(element.host, element.port, element.username, element.password)
    element.status = response.status
    element.message = response
    if (StringUtils.isNotEmpty(response.columns)) {
      element.version = response.columns[0].version
    }
    updateDataSource(element.name, element)
  })
}
