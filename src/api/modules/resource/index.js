import { axios } from '@/api/axios'

export function getResourceListPage(params) {
  return axios({
    method: 'get',
    url: '/resources/list-paging',
    params,
  })
}

export function uploadResource(data) {
  return axios({
    method: 'post',
    url: '/resources/create',
    data,
  })
}

export function verifyResourceName(params) {
  return axios({
    method: 'get',
    url: '/resources/verify-name',
    params,
  })
}

export function deleteResource(params) {
  return axios({
    method: 'get',
    url: '/resources/delete',
    params,
  })
}

export function renameResource(data) {
  return axios({
    method: 'post',
    url: '/resources/update',
    data,
  })
}

export function getResourceContent(params) {
  return axios({
    method: 'get',
    url: '/resources/view',
    params,
  })
}

export function updateResourceContent(data) {
  return axios({
    method: 'post',
    url: '/resources/update-content',
    data,
  })
}

export function getResourceId(params) {
  return axios({
    method: 'get',
    url: '/resources/queryResource',
    params,
  })
}

export function deleteUdf(params) {
  return axios({
    method: 'get',
    url: '/resources/udf-func/delete',
    params,
  })
}

export function getResourcesList(params) {
  return axios({
    method: 'get',
    url: '/resources/list',
    params,
  })
}

export function getUdfFuncListPage(params) {
  return axios({
    method: 'get',
    url: '/resources/udf-func/list-paging',
    params,
  })
}

export function createUdfFunc(data) {
  return axios({
    method: 'post',
    url: '/resources/udf-func/create',
    data,
  })
}

export function updateUdfFunc(data) {
  return axios({
    method: 'post',
    url: '/resources/udf-func/update',
    data,
  })
}

export function verifyUdfFuncName(params) {
  return axios({
    method: 'get',
    url: 'resources/udf-func/verify-name',
    params,
  })
}
