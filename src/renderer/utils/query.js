import axios from 'axios'
import { Message } from 'element-ui'
import { Promise } from 'es6-promise'

export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        resolve(response)
      }, error => {
        Message({
          message: error.message,
          type: 'error',
          duration: 5 * 1000
        })
        reject(error)
      })
  })
}

export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err.response)
      })
  })
}
