import { axios } from '@/api/axios'

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
