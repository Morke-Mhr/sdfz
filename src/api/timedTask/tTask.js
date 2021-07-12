import request from '@/utils/request'
import store from '@/store'

const job = store.state.serviceName.job
// 菜单下拉树列表
export function jobList(params) {
  return request({
    url: job + '/job/list',
    method: 'get',
    params
  })
}

// 定时任务调度管理-新增定时任务列表
export function addTask(data) {
  return request({
    url: job + '/job',
    method: 'post',
    data
  })
}

// 定时任务调度管理-修改定时任务列表
export function editTask(data) {
  return request({
    url: job + '/job',
    method: 'put',
    data
  })
}

// 定时任务调度管理-根据任务id查询定时任务信息列表
export function byJobId(jobId) {
  return request({
    url: job + `/job/${jobId}`,
    method: 'get'
  })
}

// 定时任务调度管理-根据任务id查询定时任务信息列表
export function deleteTask(jobIds) {
  return request({
    url: job + `/job/${jobIds}`,
    method: 'delete'
  })
}

export function runTask(jobId) {
  return request({
    url: job + `/job/run/${jobId}`,
    method: 'put'
  })
}
