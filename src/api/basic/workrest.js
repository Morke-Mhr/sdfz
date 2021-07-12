import request from '@/utils/request'
import store from '@/store'
const jurisdiction = store.state.serviceName.jurisdiction

// 学期管理--列表查询
export function workrestList(params) {
  return request({
    url: jurisdiction + `/workrest/list`,
    method: 'get',
    params
  })
}

// 学期新增
export function workrestAdd(data) {
  return request({
    url: jurisdiction + `/workrest`,
    method: 'POST',
    data
  })
}

// 学期删除
export function workrestDel(workrestIds) {
  return request({
    url: jurisdiction + `/workrest/${workrestIds}`,
    method: 'DELETE'
  })
}

// 学期修改
export function workrestFix(data) {
  return request({
    url: jurisdiction + `/workrest`,
    method: 'PUT',
    data
  })
}

// 详细信息查询
export function workrest(sysnworkrestId) {
  return request({
    url: jurisdiction + `/workrest/${sysnworkrestId}`,
    method: 'get'
  })
}
