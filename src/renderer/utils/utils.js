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
