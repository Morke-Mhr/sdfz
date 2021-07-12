import request from '@/utils/request'
import store from '@/store'
const serviceName = store.state.serviceName.jurisdiction

// 查询操作日志
export function getOperLogList(params) {
  return request({
    url: serviceName + `/operLog/list`,
    method: 'get',
    params
  })
}

// 批量删除操作日志
export function cleanOperLog() {
  return request({
    url: serviceName + '/operLog/clean',
    method: 'delete'
  })
}

// 清空操作日志
export function deleteOperLog(operLogIds) {
  return request({
    url: serviceName + `/operLog/${operLogIds}`,
    method: 'delete'
  })
}

// 获取详情
export function getOperLogInfo(operId) {
  return request({
    url: serviceName + `/operLog/${operId}`,
    method: 'get'
  })
}
