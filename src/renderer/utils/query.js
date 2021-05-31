import axios from 'axios'
import { Promise } from 'es6-promise'

export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        resolve(response)
      }, error => {
        reject(error.response)
      })
  })
}

export function get(url) {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(response => {
        resolve(response)
      }, error => {
        reject(error.response)
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
