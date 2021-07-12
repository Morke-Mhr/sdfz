import request from '@/utils/request'
import store from '@/store'
const listenClass = store.state.serviceName.listenClass

// 听评课类型-分页查询
export function listByPage(params) {
  return request({
    url: listenClass + `/busListenClassType/listByPage`,
    method: 'get',
    params
  })
}

// 听评课类型-增加
export function classTypeAdd(data) {
  return request({
    url: listenClass + `/busListenClassType/add`,
    method: 'post',
    data
  })
}

// 听评课类型-修改
export function classTypeFix(data) {
  return request({
    url: listenClass + `/busListenClassType`,
    method: 'put',
    data
  })
}

// 听评课类型-删除
export function classTypeDel(listenClassTypeId) {
  return request({
    url: listenClass + `/busListenClassType/${listenClassTypeId}`,
    method: 'delete'
  })
}

// 听评课类型--根据ID获取
export function busListenClassType(listenClassTypeId) {
  return request({
    url: listenClass + `/busListenClassType/${listenClassTypeId}`,
    method: 'get'
  })
}
