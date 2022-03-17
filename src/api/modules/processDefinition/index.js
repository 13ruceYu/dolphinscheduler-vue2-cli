import { axios } from '@/api/axios'

export function getProcessList(projectName, params) {
  return axios({
    method: 'get',
    url: `/projects/${projectName}/process/list-paging`,
    params,
  })
}
