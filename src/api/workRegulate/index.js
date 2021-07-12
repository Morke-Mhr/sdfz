import request from '@/utils/request'
import store from '@/store'
const jurisdiction = store.state.serviceName.jurisdiction

// 模块管理--列表查询
export function workbenchList(params) {
  return request({
    url: jurisdiction + `/workbench/list`,
    method: 'get',
    params
  })
}

// 模块新增
export function workbenchAdd(data) {
  return request({
    url: jurisdiction + `/workbench`,
    method: 'POST',
    data
  })
}

// 模块删除
export function workbenchDel(workbenchIds) {
  return request({
    url: jurisdiction + `/workbench/${workbenchIds}`,
    method: 'DELETE'
  })
}

// 模块修改
export function workbenchFix(data) {
  return request({
    url: jurisdiction + `/workbench`,
    method: 'PUT',
    data
  })
}

// 详细信息查询
export function workbench(sysnworkbenchId) {
  return request({
    url: jurisdiction + `/workbench/${sysnworkbenchId}`,
    method: 'get'
  })
}
