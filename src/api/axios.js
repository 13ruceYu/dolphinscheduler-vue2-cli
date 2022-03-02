/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import axios from 'axios'
import store from '@/store'
import qs from 'qs'
import _ from 'lodash'
import router from '@/router'

const baseRequestConfig = {
  baseURL: '/dolphinscheduler',
  timeout: 10000,
  transformRequest: (params) => {
    if (_.isPlainObject(params)) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    } else {
      return params
    }
  },
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: 'repeat' })
  },
}

const service = axios.create(baseRequestConfig)

const err = (err) => {
  if (err.response.status === 401 || err.response.status === 504) {
    store.commit('user/setSessionId', '')
    store.commit('user/setUserInfo', {})
    router.push({ path: '/login' })
  }

  return Promise.reject(err)
}

service.interceptors.request.use((config) => {
  config.headers && (config.headers.sessionId = sessionStorage.sessionId)

  return config
}, err)

// The response to intercept
service.interceptors.response.use((res) => {
  // No code will be processed
  if (res.data.code === undefined) {
    return res.data
  }

  switch (res.data.code) {
    case 0:
      return res.data.data
    default:
      throw new Error(`${res.data.msg}`)
  }
}, err)

const apiPrefix = '/dolphinscheduler'
const reSlashPrefix = /^\/+/

const resolveURL = (url) => {
  if (url.indexOf('http') === 0) {
    return url
  }
  if (url.charAt(0) !== '/') {
    return `${apiPrefix}/${url.replace(reSlashPrefix, '')}`
  }

  return url
}

/**
 * download file
 */
const downloadFile = (url, obj) => {
  const param = {
    url: resolveURL(url),
    obj: obj || {},
  }

  const form = document.createElement('form')
  form.action = param.url
  form.method = 'get'
  form.style.display = 'none'
  Object.keys(param.obj).forEach((key) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = key
    input.value = param.obj[key]
    form.appendChild(input)
  })
  const button = document.createElement('input')
  button.type = 'submit'
  form.appendChild(button)
  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}

export { service as axios, downloadFile }
