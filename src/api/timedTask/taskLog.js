import request from '@/utils/request'
import store from '@/store'

const job = store.state.serviceName.job
// 菜单下拉树列表
export function logList(params) {
  return request({
    url: job + '/job/log/list',
    method: 'get',
    params
  })
}

// 定时任务调度日志管理-根据任务日志id数组删除定时任务日志
export function deleteTask(jobLogIds) {
  return request({
    url: job + `/job/log/${jobLogIds}`,
    method: 'delete'
  })
}

// 定时任务调度日志管理-清空定时任务日志
export function logClean() {
  return request({
    url: job + '/job/log/clean',
    method: 'DELETE'
  })
}
