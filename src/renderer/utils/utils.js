export function stringFormat(formatted, args) {
  console.log(formatted)
  for (let i = 0; i < args.length; i++) {
    const regexp = new RegExp('\\{' + i + '\\}', 'gi')
    formatted = formatted.replace(regexp, args[i])
  }
  return formatted
}
