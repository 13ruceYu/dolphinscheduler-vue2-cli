import { axios } from '@/api/axios'

export function getUserInfo() {
  return axios({
    url: '/users/get-user-info',
    method: 'get',
  })
}
