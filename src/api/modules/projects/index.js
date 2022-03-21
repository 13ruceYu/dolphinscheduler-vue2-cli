import { axios } from '@/api/axios'

export function uploadWorkflow(data) {
  return axios({
    method: 'post',
    url: '/projects/import-definition',
    data,
  })
}

export function getTaskStatusCount(params) {
  return axios({
    method: 'get',
    url: '/projects/analysis/task-state-count',
    params,
  })
}

export function getProcessStateCount(params) {
  return axios({
    method: 'get',
    url: '/projects/analysis/process-state-count',
    params,
  })
}

export function getDefineUserCount(params) {
  return axios({
    method: 'get',
    url: '/projects/analysis/define-user-count',
    params,
  })
}

export function getProjectsList(params) {
  return axios({
    method: 'get',
    url: '/projects/list-paging',
    params,
  })
}
