const StringUtils = require('./StringUtils')

const WORD = 'ENGINE'

/**
 * Build the database DDL
 * <p>
 *   example:
 *    <ul>
 *      <li>CREATE DATABASE xxx</li>
 *      <li>CREATE DATABASE xxx ENGINE Atomic</li>
 *      <li>CREATE DATABASE xxx ENGINE MaterializedMySQL('host:port', ['database' | database], 'user', 'password')</li>
 *    </ul>
 * </p>
 * @param value
 * @returns {*}
 */
export function builderDatabaseDDL(value) {
  const prefix = StringUtils.format('CREATE DATABASE {0}', [value.name])
  let suffix
  switch (value.engine) {
    case 'Atomic':
      suffix = builderDatabaseAtomic(value)
      break
    case 'Lazy':
      suffix = builderDatabaseLazy(value)
      break
    case 'MySQL':
      suffix = builderDatabaseMySQL(value)
      break
    case 'Default':
    default:
      suffix = builderDatabaseDefault(value)
      break
  }
  return StringUtils.format('{0} {1}', [prefix, suffix])
}

export function builderDatabaseDefault(value) {
  return ''
}

export function builderDatabaseAtomic(value) {
  return StringUtils.format('{0} = {1}', [WORD, value.engine])
}

export function builderDatabaseLazy(value) {
  return StringUtils.format('{0} = {1}({2})', [WORD, value.engine, value.property.timeSeconds])
}

export function builderDatabaseMySQL(value) {
  let response
  if (StringUtils.isEmpty(value.property.database)) {
    response = StringUtils.format('{0} = {1}({2}, {3}, {4})', [WORD, value.engine,
      StringUtils.format('{0}:{1}', [value.property.host, value.property.port]),
      value.property.username,
      value.property.password])
  } else {
    response = StringUtils.format(`{0} = {1}('{2}', '{3}', '{4}', '{5}')`, [WORD, value.engine,
      StringUtils.format('{0}:{1}', [value.property.host, value.property.port]),
      value.property.database,
      value.property.username,
      value.property.password])
  }
  return response
}
