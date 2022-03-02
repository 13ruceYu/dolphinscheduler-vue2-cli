import { axios } from '@/api/axios'

export function login(data) {
  return axios({
    url: '/login',
    method: 'post',
    data,
  })
}
