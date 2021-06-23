export function stringFormat(formatted, args) {
  for (let i = 0; i < args.length; i++) {
    const regexp = new RegExp('\\{' + i + '\\}', 'gi')
    formatted = formatted.replace(regexp, args[i])
  }
  return formatted
}

export function getDataSource(name) {
  const dataSource = JSON.parse(localStorage.getItem('DataSources'))
    .filter(item => item.name === name)
  return dataSource
}

export function getServerURL(host, port, url) {
  let serverUrl = null
  if (port !== null && url !== null) {
    serverUrl = stringFormat('http://{0}:{1}/{2}', [host, port, url])
  } else if (port !== null) {
    serverUrl = stringFormat('http://{0}:{1}', [host, port])
  } else {
    serverUrl = stringFormat('http://{0}', [host])
  }
  return serverUrl
}

export function getFaIcon(source) {
  let icon = 'fa fa-adjust'
  switch (source) {
    case 'MergeTree':
    case 'SystemMergeTreeSettings':
    case 'SystemMerges':
      icon = 'fa fa-tree'
      break
    case 'MaterializedView':
      icon = 'fa fa-eye'
      break
    case 'SystemAggregateFunctionCombinators':
    case 'SystemBuildOptions':
      icon = 'fa fa-cog'
      break
    case 'SystemAsynchronousMetrics':
    case 'SystemGraphite':
    case 'SystemMetrics':
      icon = 'fa fa-line-chart'
      break
    case 'SystemClusters':
      icon = 'fa fa-cubes'
      break
    case 'SystemCurrentRoles':
    case 'SystemEnabledRoles':
      icon = 'fa fa-flag'
      break
  }
  return icon
}

export function getValue(source, defaultValue) {
  if (source) {
    return source
  }
  return defaultValue
}
