import ElementUI from 'element-ui'

export function success(title, message) {
  ElementUI.Notification.success({
    title: title,
    message: message
  })
}

export function error(title, message) {
  ElementUI.Notification.error({
    title: title,
    message: message
  })
}
