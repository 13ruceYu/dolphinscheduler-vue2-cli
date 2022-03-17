import { axios } from '@/api/axios'

export function uploadWorkflow(data) {
  return axios({
    method: 'post',
    url: '/projects/import-definition',
    data,
  })
}
