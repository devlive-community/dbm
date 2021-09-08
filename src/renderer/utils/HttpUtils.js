import axios from 'axios'
import { Promise } from 'es6-promise'

import Support from '@/store/Support'

const StringUtils = require('./StringUtils')

let timeout = 10 * 1000
const configuration = JSON.parse(localStorage.getItem(StringUtils.format('{0}_{1}', [Support.SETTING, 'Basic'])))

if (configuration) {
  timeout = configuration.network * 1000
}

export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data, { timeout: timeout })
      .then(response => {
        resolve(response)
      }, error => {
        if (error.response) {
          reject(error.response)
        } else {
          const result = {
            data: error.message
          }
          reject(result)
        }
      })
  })
}

export function get(url) {
  return new Promise((resolve, reject) => {
    axios.get(url, { timeout: timeout })
      .then(response => {
        resolve(response)
      }, error => {
        if (error.response) {
          reject(error.response)
        } else {
          const result = {
            data: error.message
          }
          reject(result)
        }
      })
  })
}

export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data, { timeout: timeout })
      .then(response => {
        resolve(response.data)
      }, error => {
        if (error.response) {
          reject(error.response)
        } else {
          const result = {
            data: error.message
          }
          reject(result)
        }
      })
  })
}
